import { OperationsHandlers } from "./types/operations";
import { mediasoupConfig } from "./config/mediasoup";
import { closePeer, createConsumer, createTransport, getTransportConnData } from "./utils/peers";
import { ConsumeParams, MyWorker } from "./types/mediasoup";
import { createRoom } from "./utils/rooms";
import { Room } from "./types/room";

export const handlers = (rooms: Record<string, Room>, workers: MyWorker[]): OperationsHandlers => {
	let workerIdx = 0;

	const getWorker = () => {
		const worker = workers[workerIdx];
		workerIdx = (workerIdx + 1) % mediasoupConfig.numWorkers;
		return worker;
	};

	return {
		"create-room": async (d) => {
			if (rooms[d.roomId]) return;
			rooms[d.roomId] = await createRoom(d.roomId, getWorker());
		},
		"delete-room": (d) => {
			const room = rooms[d.roomId];
			if (!room) return;
			room.router.close();
			delete rooms[d.roomId];
		},
		"@connect-webRtcTransport": async (
			{ dtlsParameters, peerId, roomId, direction },
			uid,
			send,
			errBack
		) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[peerId];
			const transport = direction === "recv" ? peer?.recvTransport : peer?.sendTransport;
			if (peer && transport) await transport.connect({ dtlsParameters });
		},
		"join-room": async ({ roomId, peerId, willProduce }, uid, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			// If the peer is already in the room, we close it to restart its connection
			if (room.state.peers[peerId]) {
				// Save the producer id (if it was a producer)
				const producerId = room.state.peers[peerId].producer?.id;
				closePeer(room, peerId);
				// If it was a producer, signal that it has been closed
				producerId && send({ op: "producer-closed", d: { roomId, producerId }, uid });
			}

			const recvTransport = await createTransport(room.router, peerId, "recv");
			const sendTransport = willProduce
				? await createTransport(room.router, peerId, "send")
				: null;

			room.state.peers[peerId] = {
				id: peerId,
				recvTransport,
				sendTransport,
				consumers: [],
				producer: null,
			};

			send({
				op: "joined-room",
				d: {
					roomId,
					peerId,
					recvTransport: getTransportConnData(recvTransport),
					sendTransport: sendTransport && getTransportConnData(sendTransport),
					rtpCapabilities: room.router.rtpCapabilities,
				},
				uid,
			});
		},
		"leave-room": ({ peerId, roomId }, uid, send) => {
			const room = rooms[roomId];
			if (!room) return;
			if (room.state.peers[peerId]) {
				// Save the producer id
				const producerId = room.state.peers[peerId].producer?.id;
				closePeer(room, peerId);
				// If it was a producer, signal that it has been closed
				producerId && send({ op: "producer-closed", d: { roomId, producerId }, uid });
			}
			// If no more peers are in the room, delete the room
			if (!Object.values(room.state.peers).length) {
				room.router.close();
				delete rooms[roomId];
			}
		},
		"@send-track": async ({ peerId, produceParams, roomId }, uid, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();

			if (!peer.sendTransport)
				return send({
					op: "@new-track",
					d: { roomId, peerId, error: "you need to create a send transport first" },
					uid,
				});

			if (peer.producer) peer.producer.close();

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
						op: "@new-track",
						d: { roomId, peerId, error: "cant consume track" },
						uid,
					});
				// Now the client needs to create the consumer as well
				// So we signal the required data to that peer
				send({ op: "@new-track", d: { roomId, peerId, consumerParams: params }, uid });
			}
		},
		"@get-recv-tracks": async ({ peerId, roomId }, uid, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();

			const consumers: ConsumeParams[] = [];

			for await (const _peer of Object.values(room.state.peers)) {
				if (peerId === _peer.id || !_peer.producer) continue;
				const consumer = await createConsumer(room, peerId, {
					producerId: _peer.producer.id,
					producerPaused: _peer.producer.paused,
					rtpCapabilities: room.router.rtpCapabilities,
				});
				if (!consumer) continue;
				consumers.push(consumer);
			}

			send({ op: "@get-recv-tracks-done", d: { consumers, peerId, roomId }, uid });
		},
		"close-consumer": ({ consumerId, peerId, roomId }, uid, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();
			peer.consumers.find((consumer) => consumer.id === consumerId)?.close();
		},
		"pause-consumer": ({ consumerId, peerId, roomId }) => {
			const room = rooms[roomId];
			if (!room) return;
			const peer = room.state.peers[peerId];
			if (!peer) return;
			peer.consumers.find((consumer) => consumer.id === consumerId)?.pause();
		},
		"resume-consumer": ({ consumerId, peerId, roomId }) => {
			const room = rooms[roomId];
			if (!room) {
				return;
			}
			const peer = room.state.peers[peerId];
			if (!peer) return;
			peer.consumers.find((consumer) => consumer.id === consumerId)?.resume();
		},
		"add-producer": async ({ peerId, roomId }, uid, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();
			if (peer.sendTransport) peer.sendTransport.close();
			const sendTransport = await createTransport(room.router, peerId, "send");
			send({
				op: "producer-added",
				d: {
					peerId,
					roomId,
					rtpCapabilities: room.router.rtpCapabilities,
					sendTransport: getTransportConnData(sendTransport),
				},
				uid,
			});
		},
		"close-producer": ({ roomId, peerId }, uid, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();
			if (!peer.producer) return;

			const producerId = peer.producer.id;
			peer.producer.close();

			send({
				op: "producer-closed",
				d: {
					producerId,
					roomId,
				},
				uid,
			});
		},
		"pause-producer": ({ roomId, peerId }, uid, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();
			peer.producer?.pause();
		},
		"resume-producer": ({ roomId, peerId }, uid, send, errBack) => {
			const room = rooms[roomId];
			if (!room) return errBack();
			const peer = room.state.peers[peerId];
			if (!peer) return errBack();
			peer.producer?.resume();
		},
	};
};
