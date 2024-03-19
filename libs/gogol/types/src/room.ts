import { Consumer, Producer, WebRtcTransport } from "mediasoup/node/lib/types";
import { MyRouter, MyWorker } from "./mediasoup";

export type ProducerKinds = "audio";

export type Room = {
	worker: MyWorker;
	router: MyRouter;
	state: RoomState;
};

export type PeerState = {
	id: string;
	recvTransport: WebRtcTransport;
	sendTransport: WebRtcTransport | null;
	producer: Record<ProducerKinds, Producer | null>;
	consumers: Consumer<{ peerId: string }>[];
};

export type RoomState = {
	id: string;
	peers: Record<string, PeerState>;
};
