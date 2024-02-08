import {
	ConsumerType,
	DtlsParameters,
	IceCandidate,
	IceParameters,
	MediaKind,
	Router,
	RtpParameters,
	SctpParameters,
	WebRtcTransport,
	Worker,
} from "mediasoup/node/lib/types";

export type MyWorker = Worker<{ id: string }>;

export type MyRouter = Router;

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
	producerPaused: boolean;
};
