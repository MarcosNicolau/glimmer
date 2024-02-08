import {
	MediaKind,
	RtpCapabilities,
	RtpParameters,
	WebRtcTransport,
} from "mediasoup/node/lib/types";
import { OutgoingQueueMessage } from "../loaders";
import { ConsumeParams, TransportDirection, WebRtcTransportConnData } from "./mediasoup";

export type ConsumeOperationsData = {
	"create-room": {
		roomId: string;
	};
	"delete-room": {
		roomId: string;
	};
	"@connect-webRtcTransport": {
		roomId: string;
		peerId: string;
		direction: TransportDirection;
		dtlsParameters: WebRtcTransport["dtlsParameters"];
	};
	"@send-track": {
		roomId: string;
		peerId: string;
		produceParams: {
			id: string;
			kind: MediaKind;
			rtpParameters: RtpParameters;
			paused: boolean;
		};
	};
	"@get-recv-tracks": {
		roomId: string;
		peerId: string;
	};
	"join-room": {
		roomId: string;
		peerId: string;
		willProduce: boolean;
	};
	"leave-room": {
		roomId: string;
		peerId: string;
	};
	"close-consumer": {
		roomId: string;
		peerId: string;
		consumerId: string;
	};
	"pause-consumer": {
		roomId: string;
		peerId: string;
		consumerId: string;
	};
	"resume-consumer": {
		roomId: string;
		peerId: string;
		consumerId: string;
	};
	"add-producer": {
		roomId: string;
		peerId: string;
	};
	"close-producer": {
		roomId: string;
		peerId: string;
	};
	"pause-producer": {
		roomId: string;
		peerId: string;
	};
	"resume-producer": {
		roomId: string;
		peerId: string;
	};
};

export type ConsumeOperations = keyof ConsumeOperationsData;

export type SendOperationsData = {
	"room-created": {
		roomId: string;
	};
	"joined-room": {
		roomId: string;
		peerId: string;
		rtpCapabilities: RtpCapabilities;
		recvTransport: WebRtcTransportConnData;
		sendTransport: WebRtcTransportConnData | null;
	};
	"producer-added": {
		roomId: string;
		peerId: string;
		rtpCapabilities: RtpCapabilities;
		sendTransport: WebRtcTransportConnData;
	};
	"@get-recv-tracks-done": {
		roomId: string;
		peerId: string;
		consumers: ConsumeParams[];
	};
	"@new-track":
		| {
				roomId: string;
				peerId: string;
				consumerParams: ConsumeParams;
		  }
		| { roomId: string; peerId: string; error: string };
	"producer-closed": {
		roomId: string;
		producerId: string;
	};
	error: { message: string };
};

export type SendOperations = keyof SendOperationsData;

export type Send = <T extends SendOperations>({}: OutgoingQueueMessage<T>) => void;

export type OperationsHandlers = {
	[key in ConsumeOperations]: (
		d: ConsumeOperationsData[key],
		uid: string,
		send: Send,
		errBack: () => void
	) => void;
};
