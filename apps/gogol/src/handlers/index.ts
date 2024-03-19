import { OperationsHandlers } from "../types/operations";
import { mediasoupConfig } from "../config/mediasoup";
import {
	closePeer,
	createConsumer,
	createTransport,
	getAllConsumers,
	getTransportConnData,
	signalProducerClosed,
} from "../utils/peers";
import { MyWorker, Room } from "@glimmer/gogol";
import { createRoom } from "../utils/rooms";
import { ENV_VARS } from "../config/env";
import { sendRoomNotExist } from "./helpers";

export const handlers = (rooms: Record<string, Room>, workers: MyWorker[]): OperationsHandlers => {
	let workerIdx = 0;

	const getWorker = () => {
		const worker = workers[workerIdx];
		workerIdx = (workerIdx + 1) % mediasoupConfig.numWorkers;
		return worker;
	};

	return {
		"@room:create": async (d, send) => {
			if (rooms[d.roomId]) return;
			rooms[d.roomId] = await createRoom(d.roomId, getWorker());
			send({
				op: "@room:created",
				d: { roomId: d.roomId, serverId: ENV_VARS.SERVER_ID || "" },
			});
		},
		"@room:delete": (d) => {
			const room = rooms[d.roomId];
			if (!room) return;
			room.router.close();
			delete rooms[d.roomId];
		},
		"@room:connect-webRtcTransport": async (
			{ dtlsParameters, peerId, roomId, direction },
			send
		) => {
			const room = rooms[roomId];
			if (!room) return sendRoomNotExist(roomId, peerId, send);
			const peer = room.state.peers[peerId];
			const transport = direction === "recv" ? peer?.recvTransport : peer?.sendTransport;
			if (peer && transport) {
				await transport.connect({ dtlsParameters });
				send({ op: `@room:${direction}-transport-connected`, d: { peerId, roomId } });
			}
		},
		"@room:join": async ({ roomId, peerId, willProduce }, send) => {
			const room = rooms[roomId];
			if (!room) return sendRoomNotExist(roomId, peerId, send);
			// If the peer is already in the room, we close it to restart its connection
			if (room.state.peers[peerId]) closePeer(room, peerId, send);
			const recvTransport = await createTransport(room.router, peerId, "recv");
			const sendTransport = willProduce
				? await createTransport(room.router, peerId, "send")
				: null;

			room.state.peers[peerId] = {
				id: peerId,
				recvTransport,
				sendTransport,
				consumers: [],
				producer: {
					audio: null,
				},
			};

			// Create and push the consumers for the peer
			const consumers = await getAllConsumers(peerId, room, room.router.rtpCapabilities);

			send({
				op: "@room:you-joined",
				d: {
					roomId,
					peerId,
					recvTransport: getTransportConnData(recvTransport),
					sendTransport: sendTransport && getTransportConnData(sendTransport),
					rtpCapabilities: room.router.rtpCapabilities,
					consumers,
				},
			});
		},
		"@room:leave": async ({ peerId, roomId }, send) => {
			const room = rooms[roomId];
			if (!room) return;
			if (room.state.peers[peerId]) closePeer(room, peerId, send);
			// If no more peers are in the room, delete the room
			if (!Object.values(room.state.peers).length) {
				room.router.close();
				delete rooms[roomId];
			}
		},
		"@room:send-track": async ({ peerId, produceParams, roomId }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return sendRoomNotExist(roomId, peerId, send);
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();
			const kind = produceParams.kind;
			//For now, we only support audio streaming
			if (kind !== "audio") return errBack();

			if (!peer.sendTransport)
				return send({
					op: "@room:new-track",
					d: { roomId, peerId, error: "you need to create a send transport first" },
				});

			if (peer.producer[kind]) {
				send({
					op: "@room:producer-closed",
					// @ts-expect-error complains about possibly being null, but we are actually checking that in the if
					d: { producerId: peer.producer[kind].id, roomId, peerId },
				});
				peer.producer[kind]?.close();
			}

			const producer = await peer.sendTransport.produce({
				kind,
				rtpParameters: produceParams.rtpParameters,
				paused: false,
			});
			peer.producer[kind] = producer;
			send({
				op: "@room:send-track-done",
				d: { roomId, peerId, producerId: producer.id },
			});
			// We need to add tell each peer to consume the new producer
			for await (const _peer of Object.values(room.state.peers)) {
				if (_peer.id === peer.id) continue;

				// Create the consumer on the server
				const consumerParams = await createConsumer(room, _peer.id, {
					producerId: producer.id,
					rtpCapabilities: room.router.rtpCapabilities,
					producerPaused: producer.paused,
				});
				if (!consumerParams)
					return send({
						op: "@room:new-track",
						d: { roomId, peerId: _peer.id, error: "cant consume track" },
					});
				// Now the client needs to create the consumer as well
				// So we signal the required data to that peer
				send({
					op: "@room:new-track",
					d: { roomId, peerId: _peer.id, consumerParams },
				});
			}
		},
		"@room:get-recv-tracks": async ({ peerId, roomId, rtpCapabilities }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return sendRoomNotExist(roomId, peerId, send);
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();

			const consumers = await getAllConsumers(peerId, room, rtpCapabilities);

			send({ op: "@room:get-recv-tracks-done", d: { consumers, peerId, roomId } });
		},
		"@room:close-consumer": ({ consumerId, peerId, roomId }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return sendRoomNotExist(roomId, peerId, send);
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();
			peer.consumers.find((consumer) => consumer.id === consumerId)?.close();
		},
		"@room:pause-consumer": ({ consumerId, peerId, roomId }) => {
			const room = rooms[roomId];
			if (!room) return;
			const peer = room.state.peers[peerId];
			if (!peer) return;
			peer.consumers.find((consumer) => consumer.id === consumerId)?.pause();
		},
		"@room:resume-consumer": ({ peerId, roomId, consumerId }, send) => {
			const room = rooms[roomId];
			if (!room) return sendRoomNotExist(roomId, peerId, send);
			const peer = room.state.peers[peerId];
			if (!peer) return;
			peer.consumers.find((consumer) => consumer.id === consumerId)?.resume();
		},
		"@room:add-producer": async ({ peerId, roomId }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return sendRoomNotExist(roomId, peerId, send);
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();
			if (peer.sendTransport) peer.sendTransport.close();
			const sendTransport = await createTransport(room.router, peerId, "send");
			send({
				op: "@room:producer-added",
				d: {
					peerId,
					roomId,
					rtpCapabilities: room.router.rtpCapabilities,
					sendTransport: getTransportConnData(sendTransport),
				},
			});
		},
		"@room:close-producer": ({ roomId, peerId, kindsToClose }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return sendRoomNotExist(roomId, peerId, send);
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();
			const audioProducer = kindsToClose.audio ? peer.producer.audio : null;

			if (audioProducer) {
				const audioId = audioProducer.id;
				audioProducer.close();
				if (audioId) signalProducerClosed(room.state.id, peerId, { audio: audioId }, send);
			}
		},
		"@room:pause-producer": ({ roomId, peerId, kind }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return sendRoomNotExist(roomId, peerId, send);
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();
			peer.producer[kind]?.pause();
		},
		"@room:resume-producer": ({ roomId, peerId, kind }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return sendRoomNotExist(roomId, peerId, send);
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();
			peer.producer[kind]?.pause();
		},
	};
};
