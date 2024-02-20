import { OperationsHandlers } from "./types/operations";
import { mediasoupConfig } from "./config/mediasoup";
import {
	closePeer,
	createConsumer,
	createTransport,
	getAllConsumers,
	getTransportConnData,
} from "./utils/peers";
import { MyWorker } from "./types/mediasoup";
import { createRoom } from "./utils/rooms";
import { Room } from "./types/room";
import { ENV_VARS } from "./config/env";

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
			{ dtlsParameters, userId, roomId, direction },

			send,
			errBack
		) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[userId];
			const transport = direction === "recv" ? peer?.recvTransport : peer?.sendTransport;
			if (peer && transport) await transport.connect({ dtlsParameters });
		},
		"@room:join": async ({ roomId, userId, willProduce }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			// If the peer is already in the room, we close it to restart its connection
			if (room.state.peers[userId]) {
				// Save the producer id (if it was a producer)
				const producerId = room.state.peers[userId].producer?.id;
				closePeer(room, userId);
				// If it was a producer, signal that it has been closed
				producerId && send({ op: "@room:speaker-closed", d: { roomId, producerId } });
			}

			const recvTransport = await createTransport(room.router, userId, "recv");
			const sendTransport = willProduce
				? await createTransport(room.router, userId, "send")
				: null;

			room.state.peers[userId] = {
				id: userId,
				recvTransport,
				sendTransport,
				consumers: [],
				producer: null,
			};

			const consumers = await getAllConsumers(userId, room);

			send({
				op: "@room:you-joined",
				d: {
					roomId,
					userId,
					recvTransport: getTransportConnData(recvTransport),
					sendTransport: sendTransport && getTransportConnData(sendTransport),
					rtpCapabilities: room.router.rtpCapabilities,
					consumers,
				},
			});
		},
		"@room:leave": ({ userId, roomId }, send) => {
			const room = rooms[roomId];
			if (!room) return;
			if (room.state.peers[userId]) {
				// Save the producer id
				const producerId = room.state.peers[userId].producer?.id;
				closePeer(room, userId);
				// If it was a producer, signal that it has been closed
				producerId && send({ op: "@room:speaker-closed", d: { roomId, producerId } });
			}
			// If no more peers are in the room, delete the room
			if (!Object.values(room.state.peers).length) {
				room.router.close();
				delete rooms[roomId];
			}
		},
		"@room:send-track": async ({ userId, produceParams, roomId }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[userId];
			if (!peer) return errBack();

			if (!peer.sendTransport)
				return send({
					op: "@room:new-track",
					d: { roomId, userId, error: "you need to create a send transport first" },
				});

			if (peer.producer) {
				send({
					op: "@room:speaker-closed",
					d: { producerId: peer.producer.id, roomId },
				});
				peer.producer.close();
			}

			const producer = await peer.sendTransport.produce(produceParams);
			peer.producer = producer;

			// We need to add tell each peer to consume the new producer
			for await (const _peer of Object.values(room.state.peers)) {
				if (_peer.id === peer.id) continue;
				// Create the consumer on the server
				const params = await createConsumer(room, _peer.id, {
					producerId: producer.id,
					rtpCapabilities: room.router.rtpCapabilities,
					producerPaused: producer.paused,
				});
				if (!params)
					return send({
						op: "@room:new-track",
						d: { roomId, userId, error: "cant consume track" },
					});
				// Now the client needs to create the consumer as well
				// So we signal the required data to that peer
				send({ op: "@room:new-track", d: { roomId, userId, consumerParams: params } });
			}
		},
		"@room:get-recv-tracks": async ({ userId, roomId }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[userId];
			if (!peer) return errBack();

			const consumers = await getAllConsumers(userId, room);

			send({ op: "@room:get-recv-tracks-done", d: { consumers, userId, roomId } });
		},
		"@room:close-consumer": ({ consumerId, userId, roomId }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[userId];
			if (!peer) return errBack();
			peer.consumers.find((consumer) => consumer.id === consumerId)?.close();
		},
		"@room:pause-consumer": ({ consumerId, userId, roomId }) => {
			const room = rooms[roomId];
			if (!room) return;
			const peer = room.state.peers[userId];
			if (!peer) return;
			peer.consumers.find((consumer) => consumer.id === consumerId)?.pause();
		},
		"@room:resume-consumer": ({ consumerId, userId, roomId }) => {
			const room = rooms[roomId];
			if (!room) {
				return;
			}
			const peer = room.state.peers[userId];
			if (!peer) return;
			peer.consumers.find((consumer) => consumer.id === consumerId)?.resume();
		},
		"@room:add-producer": async ({ userId, roomId }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[userId];
			if (!peer) return errBack();
			if (peer.sendTransport) peer.sendTransport.close();
			const sendTransport = await createTransport(room.router, userId, "send");
			send({
				op: "@room:you-are-a-speaker",
				d: {
					userId,
					roomId,
					rtpCapabilities: room.router.rtpCapabilities,
					sendTransport: getTransportConnData(sendTransport),
				},
			});
		},
		"@room:close-producer": ({ roomId, userId }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[userId];
			if (!peer) return errBack();
			if (!peer.producer) return;

			const producerId = peer.producer.id;
			peer.producer.close();

			send({
				op: "@room:speaker-closed",
				d: {
					producerId,
					roomId,
				},
			});
		},
		"@room:pause-producer": ({ roomId, userId }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[userId];
			if (!peer) return errBack();
			peer.producer?.pause();
		},
		"@room:resume-producer": ({ roomId, userId }, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[userId];
			if (!peer) return errBack();
			peer.producer?.resume();
		},
	};
};
