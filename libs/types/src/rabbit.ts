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

export type MyWebRtcTransport = WebRtcTransport<{ direction: TransportDirection; userId: string }>;

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
	producerPaused: boolean;
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
		userId: string;
		willProduce: boolean;
	};
	"@room:leave": {
		roomId: string;
		userId: string;
	};
	"@room:connect-webRtcTransport": {
		roomId: string;
		userId: string;
		direction: TransportDirection;
		dtlsParameters: WebRtcTransport["dtlsParameters"];
	};
	"@room:send-track": {
		roomId: string;
		userId: string;
		produceParams: {
			id: string;
			kind: MediaKind;
			rtpParameters: RtpParameters;
			paused: boolean;
		};
	};
	"@room:get-recv-tracks": {
		roomId: string;
		userId: string;
	};
	"@room:close-consumer": {
		roomId: string;
		userId: string;
		consumerId: string;
	};
	"@room:pause-consumer": {
		roomId: string;
		userId: string;
		consumerId: string;
	};
	"@room:resume-consumer": {
		roomId: string;
		userId: string;
		consumerId: string;
	};
	"@room:add-producer": {
		roomId: string;
		userId: string;
	};
	"@room:close-producer": {
		roomId: string;
		userId: string;
	};
	"@room:pause-producer": {
		roomId: string;
		userId: string;
	};
	"@room:resume-producer": {
		roomId: string;
		userId: string;
	};
};

export type BulgakovOperations = keyof BulgakovMsgData;

export type GogolMsgData = {
	"@room:created": {
		roomId: string;
		serverId: string;
	};
	"@room:you-joined": {
		roomId: string;
		userId: string;
		rtpCapabilities: RtpCapabilities;
		recvTransport: WebRtcTransportConnData;
		sendTransport: WebRtcTransportConnData | null;
		consumers: ConsumeParams[];
	};
	"@room:you-are-a-speaker": {
		roomId: string;
		userId: string;
		rtpCapabilities: RtpCapabilities;
		sendTransport: WebRtcTransportConnData;
	};
	"@room:get-recv-tracks-done": {
		roomId: string;
		userId: string;
		consumers: ConsumeParams[];
	};
	"@room:new-track":
		| {
				roomId: string;
				userId: string;
				consumerParams: ConsumeParams;
		  }
		| { roomId: string; userId: string; error: string };
	"@room:speaker-closed": {
		roomId: string;
		producerId: string;
	};
	error: {
		message: "server-closed" | "unexpected-error";
		description: string;
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
export type BroadcastToRoomOps = Extract<GogolOperations, "@room:speaker-closed">;

// the gogol operations that bulgakov should sent to the a individual user inside a room
export type BroadcastToUserOps = Extract<
	GogolOperations,
	| "@room:new-track"
	| "@room:get-recv-tracks-done"
	| "@room:you-are-a-speaker"
	| "@room:you-joined"
>;

export const broadcastToRoomOps: BroadcastToRoomOps[] = ["@room:speaker-closed"];
export const broadcastToUserOps: BroadcastToUserOps[] = [
	"@room:new-track",
	"@room:get-recv-tracks-done",
	"@room:you-are-a-speaker",
	"@room:you-joined",
];
