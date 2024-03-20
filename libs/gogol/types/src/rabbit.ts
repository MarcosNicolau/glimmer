import { ProducerKinds } from "libs/gogol/types/src/room";
import {
	ConsumerType,
	DtlsParameters,
	IceCandidate,
	IceParameters,
	SctpParameters,
	MediaKind,
	RtpCapabilities,
	RtpParameters,
	WebRtcTransport,
} from "mediasoup/node/lib/types";

export type TransportDirection = "recv" | "send";

export type MyWebRtcTransport = WebRtcTransport<{ direction: TransportDirection; peerId: string }>;

export type WebRtcTransportConnData = {
	id: string;
	iceParameters: IceParameters;
	iceCandidates: IceCandidate[];
	dtlsParameters: DtlsParameters;
	sctpParameters?: SctpParameters;
};

export type ConsumeParams = {
	id: string;
	producerId: string;
	kind: MediaKind;
	rtpParameters: RtpParameters;
	type: ConsumerType;
	appData: {
		peerId: string;
	};
};

export type BulgakovMsgData = {
	"@room:create": {
		roomId: string;
	};
	"@room:delete": {
		roomId: string;
	};
	"@room:join": {
		roomId: string;
		peerId: string;
		willProduce: boolean;
	};
	"@room:leave": {
		roomId: string;
		peerId: string;
	};
	"@room:connect-webRtcTransport": {
		roomId: string;
		peerId: string;
		direction: TransportDirection;
		dtlsParameters: WebRtcTransport["dtlsParameters"];
	};
	"@room:send-track": {
		roomId: string;
		peerId: string;
		produceParams: {
			kind: MediaKind;
			rtpParameters: RtpParameters;
			paused: boolean;
		};
	};
	"@room:get-recv-tracks": {
		roomId: string;
		peerId: string;
		rtpCapabilities: RtpCapabilities;
	};
	"@room:close-consumer": {
		roomId: string;
		peerId: string;
		consumerId: string;
	};
	"@room:pause-consumer": {
		roomId: string;
		peerId: string;
		consumerId: string;
	};
	"@room:resume-consumer": {
		roomId: string;
		peerId: string;
		consumerId: string;
	};
	"@room:add-producer": {
		roomId: string;
		peerId: string;
	};
	"@room:close-producer": {
		roomId: string;
		peerId: string;
		kindsToClose: Record<ProducerKinds, boolean>;
	};
	"@room:pause-producer": {
		roomId: string;
		peerId: string;
		kind: ProducerKinds;
	};
	"@room:resume-producer": {
		roomId: string;
		peerId: string;
		kind: ProducerKinds;
	};
};

export type BulgakovOperations = keyof BulgakovMsgData;

export type GogolMsgData = {
	"@room:created": {
		roomId: string;
		serverId: string;
	};
	"@room:deleted": {
		roomId: string;
	};
	"@room:you-joined": {
		peerId: string;
		rtpCapabilities: RtpCapabilities;
		recvTransport: WebRtcTransportConnData;
		sendTransport: WebRtcTransportConnData | null;
		consumers: ConsumeParams[];
	};
	"@room:send-track-done": {
		peerId: string;
		producerId: string;
	};
	"@room:get-recv-tracks-done": {
		peerId: string;
		consumers: ConsumeParams[];
	};
	"@room:send-transport-connected": {
		peerId: string;
	};
	"@room:recv-transport-connected": {
		peerId: string;
	};
	"@room:new-track": {
		peerId: string;
		consumerParams?: ConsumeParams;
		error?: string;
	};
	"@room:producer-added": {
		peerId: string;
		rtpCapabilities: RtpCapabilities;
		sendTransport: WebRtcTransportConnData;
	};
	"@room:producer-closed": {
		roomId: string;
		peerId: string;
		producerIds: Record<ProducerKinds, string>;
	};
	error: {
		message: "server-closed" | "unexpected-error";
		description: string;
		serverId: string;
	};
};

export type GogolOperations = keyof GogolMsgData;

export type GogolMessage<T extends GogolOperations> = {
	op: T;
	d: GogolMsgData[T];
};

export type BulgakovMessage<T extends BulgakovOperations> = {
	op: T;
	d: BulgakovMsgData[T];
};

// the gogol operations that bulgakov should broadcast to the whole room
export type BroadcastToRoomOps = Extract<
	GogolOperations,
	"@room:producer-closed" | "@room:deleted"
>;

// the gogol operations that bulgakov should sent to the a individual user inside a room
export type BroadcastToUserOps = Extract<
	GogolOperations,
	| "@room:new-track"
	| "@room:get-recv-tracks-done"
	| "@room:producer-added"
	| "@room:you-joined"
	| "@room:send-track-done"
	| "@room:send-transport-connected"
	| "@room:recv-transport-connected"
>;

export const broadcastToRoomOps: BroadcastToRoomOps[] = ["@room:deleted"];
export const broadcastToUserOps: BroadcastToUserOps[] = [
	"@room:new-track",
	"@room:get-recv-tracks-done",
	"@room:producer-added",
	"@room:you-joined",
	"@room:send-track-done",
	"@room:send-transport-connected",
	"@room:recv-transport-connected",
];
