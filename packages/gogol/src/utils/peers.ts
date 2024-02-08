import { RtpCapabilities } from "mediasoup/node/lib/types";
import { mediasoupConfig } from "../config/mediasoup";
import {
	ConsumeParams,
	MyRouter,
	MyWebRtcTransport,
	TransportDirection,
	WebRtcTransportConnData,
} from "../types/mediasoup";
import { WebRtcTransport } from "mediasoup/node/lib/WebRtcTransport";
import { Room } from "../types/room";

export const createTransport = async (
	router: MyRouter,
	peerId: string,
	direction: TransportDirection
): Promise<MyWebRtcTransport> => {
	return await router.createWebRtcTransport({
		...mediasoupConfig.webRtcTransport,
		appData: { direction, peerId: peerId },
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

export const closePeer = async (room: Room, peerId: string) => {
	const peer = room.state.peers[peerId];
	if (!peer) return;
	delete room.state.peers[peerId];
	peer.consumers?.forEach((consumer) => consumer.close());
	peer.recvTransport?.close();
	// When the producer closes also do its associated consumers.
	peer.sendTransport?.close();
	// In theory, the producer gets closed when its associated transport is closed (sendTransport).
	// The same logic goes for the consumers and the recvTransport
	peer.producer?.close();
};

export const createConsumer = async (
	room: Room,
	peerId: string,
	{
		producerId,
		rtpCapabilities,
		producerPaused,
	}: { producerId: string; rtpCapabilities: RtpCapabilities; producerPaused: boolean }
): Promise<ConsumeParams | null> => {
	const peer = room.state.peers[peerId];
	if (room.router.canConsume({ producerId, rtpCapabilities })) {
		console.log("client cannot consume");
		return null;
	}
	const consumer = await peer.recvTransport.consume({ producerId, rtpCapabilities });
	peer.consumers.push(consumer);
	const { id, kind, rtpParameters, type } = consumer;

	return {
		id,
		kind,
		producerId,
		producerPaused,
		rtpParameters,
		type,
	};
};
