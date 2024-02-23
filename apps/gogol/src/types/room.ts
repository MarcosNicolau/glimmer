import { Consumer, Producer, WebRtcTransport } from "mediasoup/node/lib/types";
import { MyRouter, MyWorker } from "./mediasoup";

export type Room = {
	worker: MyWorker;
	router: MyRouter;
	state: RoomState;
};

export type PeerState = {
	id: string;
	recvTransport: WebRtcTransport;
	sendTransport: WebRtcTransport | null;
	producer: Record<"audio", Producer | null>;
	consumers: Consumer[];
};

export type RoomState = {
	id: string;
	peers: Record<string, PeerState>;
};
