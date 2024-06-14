import { RtpCapabilities } from "mediasoup/node/lib/types";
import { mediasoupConfig } from "../config/mediasoup";
import {
	ConsumeParams,
	MyWebRtcTransport,
	ProducerKinds,
	TransportDirection,
	WebRtcTransportConnData,
} from "@glimmer/gogol";
import { WebRtcTransport } from "mediasoup/node/lib/WebRtcTransport";
import { Room, MyRouter } from "@glimmer/gogol";
import { Send } from "../types/operations";

export const createTransport = async (
	router: MyRouter,
	peerId: string,
	direction: TransportDirection
): Promise<MyWebRtcTransport> => {
	return router.createWebRtcTransport({
		...mediasoupConfig.webRtcTransport,
		appData: { direction, peerId },
	});
};

export const getTransportConnData = (transport: WebRtcTransport): WebRtcTransportConnData => {
	const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } = transport;
	return {
		id,
		iceParameters,
		iceCandidates,
		dtlsParameters,
		sctpParameters,
	};
};

export const signalProducerClosed = (
	roomId: string,
	peerId: string,
	ids: Record<ProducerKinds, string>,
	send: Send
) => {
	send({
		op: "@room:producer-closed",
		d: { producerIds: ids, peerId },
		to: {
			roomId,
		},
	});
};

export const closePeer = (room: Room, peerId: string, send: Send) => {
	const peer = room.state.peers[peerId];
	if (!peer) return;
	const audioId = room.state.peers[peerId].producer.audio?.id;
	peer.recvTransport?.close();
	// When the producer closes also do its associated consumers.
	peer.sendTransport?.close();
	// If it was a producer, signal that it has been closed
	audioId && signalProducerClosed(room.state.id, peerId, { audio: audioId }, send);
	delete room.state.peers[peerId];
};

export const createConsumer = async (
	room: Room,
	peerId: string,
	{
		producerId,
		rtpCapabilities,
	}: { producerId: string; rtpCapabilities: RtpCapabilities; producerPaused: boolean }
): Promise<ConsumeParams | null> => {
	const peer = room.state.peers[peerId];
	if (!room.router.canConsume({ producerId, rtpCapabilities })) {
		console.log("client cannot consume");
		return null;
	}
	const consumer = await peer.recvTransport.consume({
		producerId,
		rtpCapabilities,
		paused: true,
		appData: {
			peerId,
		},
	});
	peer.consumers.push(consumer);
	const { id, kind, rtpParameters, type, appData } = consumer;

	return {
		id,
		kind,
		producerId,
		rtpParameters,
		type,
		appData,
	};
};

export const getAllConsumers = async (
	peerId: string,
	room: Room,
	rtpCapabilities: RtpCapabilities
) => {
	const consumers: ConsumeParams[] = [];

	for await (const _peer of Object.values(room.state.peers)) {
		if (peerId === _peer.id || !_peer.producer.audio) continue;
		const consumer = await createConsumer(room, peerId, {
			producerId: _peer.producer.audio.id,
			producerPaused: _peer.producer.audio.paused,
			rtpCapabilities: rtpCapabilities,
		});
		if (!consumer) continue;
		consumers.push(consumer);
	}

	return consumers;
};
