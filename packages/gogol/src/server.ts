import { mediasoupConfig } from "./config/mediasoup";
import { createWorkers, startRabbit } from "./loaders";
import { Room } from "./types/room";
import {
	closePeer,
	createConsumer,
	createTransport,
	getTransportConnData,
} from "./utils/mediasoup";
import { ConsumeParams } from "./types/mediasoup";

const main = async () => {
	const rooms: Record<string, Room> = {};

	let workerIdx = 0;
	const workers = await createWorkers(mediasoupConfig.numWorkers);

	const getWorker = () => {
		const worker = workers[workerIdx];
		workerIdx = (workerIdx + 1) % mediasoupConfig.numWorkers;
		return worker;
	};

	const createRoom = async (roomId: string): Promise<Room> => {
		const worker = getWorker();

		const router = await worker.createRouter({ ...mediasoupConfig.router });

		console.log(`room created on worker ${worker.appData.id} and router ${router.id}`);

		return {
			worker,
			router,
			state: {
				id: roomId,
				peers: {},
			},
		};
	};

	// TODO a general error checking (make sure rooms exist)
	await startRabbit({
		"create-room": async (d) => {
			if (rooms[d.roomId]) return;
			rooms[d.roomId] = await createRoom(d.roomId);
		},
		"delete-room": (d, uid, send, defaultErr) => {
			const room = rooms[d.roomId];
			if (!room) defaultErr(uid);
			room.router.close();
			delete rooms[d.roomId];
		},
		"@connect-webRtcTransport": async ({ dtlsParameters, peerId, roomId, direction }) => {
			const room = rooms[roomId];
			const peer = room.state.peers[peerId];
			const transport = direction === "recv" ? peer?.recvTransport : peer?.sendTransport;
			if (peer && transport) await transport.connect({ dtlsParameters });
		},
		"join-room": async ({ roomId, peerId, willProduce }, uid, send) => {
			const room = rooms[roomId];
			// If the peer is already in the room, we close it to restart its connection
			if (room.state.peers[peerId]) {
				// Save the producer id(if it was a producer)
				const producerId = room.state.peers[peerId].producer?.id;
				closePeer(room, peerId);
				// If it was a producer, signal that it has been closed
				producerId && send({ op: "producer-closed", d: { roomId, producerId }, uid });
			}
			// TODO error catching
			const recvTransport = await createTransport(room.router, peerId, "recv");
			const sendTransport = willProduce
				? await createTransport(room.router, peerId, "send")
				: null;
			room.state.peers[peerId].recvTransport = recvTransport;
			room.state.peers[peerId].sendTransport = sendTransport;

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
		"@send-track": async ({ peerId, produceParams, roomId }, uid, send) => {
			const room = rooms[roomId];
			const peer = room.state.peers[peerId];
			if (!peer.sendTransport) {
				send({
					op: "error",
					d: { message: "you need to create a send transport first" },
					uid,
				});
				return;
			}

			if (peer.producer) peer.producer.close();

			//TODO error catching
			const producer = await peer.sendTransport.produce(produceParams);
			peer.producer = producer;

			// We need to add a new consumer for the new producer for each peer
			for await (const _peer of Object.values(room.state.peers)) {
				if (_peer.id === peer.id) continue;
				// Create the consumer on the server
				const params = await createConsumer(room, _peer.id, {
					producerId: producer.id,
					rtpCapabilities: room.router.rtpCapabilities,
					producerPaused: producer.paused,
				});
				if (!params) {
					//TODO send error
					return;
				}
				// Now we need the client needs to create the consumer as well
				// So we signal the required data to that peer
				send({ op: "@new-track", d: { roomId, peerId, consumerParams: params }, uid });
			}
		},
		"@get-recv-tracks": async ({ peerId, roomId }, uid, send) => {
			const room = rooms[roomId];
			if (!room) return;
			const peer = room.state.peers[peerId];
			if (!peer) return;

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

			send({ op: "@get-recv-tracks-done", d: { consumers, peerId }, uid });
		},
		"close-consumer": ({ consumerId, peerId, roomId }) => {
			const room = rooms[roomId];
			if (!room) {
				return;
			}
			const peer = room.state.peers[peerId];
			if (!peer) return;
			peer.consumers.find((consumer) => consumer.id === consumerId)?.close();
		},
		"pause-consumer": ({ consumerId, peerId, roomId }) => {
			const room = rooms[roomId];
			if (!room) {
				return;
			}
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
		"add-producer": async ({ peerId, roomId }, uid, send) => {
			const room = rooms[roomId];
			if (!room) {
				return;
			}
			const peer = room.state.peers[peerId];
			if (!peer) return;
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
		"close-producer": ({ roomId, peerId }, uid, send) => {
			const room = rooms[roomId];
			if (!room) {
				return;
			}
			const peer = room.state.peers[peerId];
			if (!peer) return;
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
		"pause-producer": ({ roomId, peerId }) => {
			const room = rooms[roomId];
			if (!room) {
				return;
			}
			const peer = room.state.peers[peerId];
			if (!peer) return;
			peer.producer?.pause();
		},
		"resume-producer": ({ roomId, peerId }) => {
			const room = rooms[roomId];
			if (!room) {
				return;
			}
			const peer = room.state.peers[peerId];
			if (!peer) return;
			peer.producer?.resume();
		},
	});
};

main();
