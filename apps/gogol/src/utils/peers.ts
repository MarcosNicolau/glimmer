import { RtpCapabilities } from "mediasoup/node/lib/types";
import { mediasoupConfig } from "../config/mediasoup";
import {
    ConsumeParams,
    MyWebRtcTransport,
    TransportDirection,
    WebRtcTransportConnData,
} from "@glimmer/types";
import { WebRtcTransport } from "mediasoup/node/lib/WebRtcTransport";
import { Room } from "../types/room";
import { MyRouter } from "../types/mediasoup";

export const createTransport = async (
    router: MyRouter,
    userId: string,
    direction: TransportDirection
): Promise<MyWebRtcTransport> => {
    return await router.createWebRtcTransport({
        ...mediasoupConfig.webRtcTransport,
        appData: { direction, userId: userId },
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

export const closePeer = async (room: Room, userId: string) => {
    const peer = room.state.peers[userId];
    if (!peer) return;
    delete room.state.peers[userId];
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
    userId: string,
    {
        producerId,
        rtpCapabilities,
        producerPaused,
    }: { producerId: string; rtpCapabilities: RtpCapabilities; producerPaused: boolean }
): Promise<ConsumeParams | null> => {
    const peer = room.state.peers[userId];
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
