import {
	RtpCodecCapability,
	WebRtcTransportOptions,
	WorkerSettings,
} from "mediasoup/node/lib/types";
import os from "os";
import { ENV_VARS } from "./env";

export const mediasoupConfig = {
	numWorkers: os.cpus().length,
	worker: {
		rtcMinPort: 40000,
		rtcMaxPort: 49999,
		logLevel: "debug",
		logTags: [
			"info",
			"ice",
			"dtls",
			"rtp",
			"srtp",
			"rtcp",
			// 'rtx',
			// 'bwe',
			// 'score',
			// 'simulcast',
			// 'svc'
		],
	} as WorkerSettings,
	router: {
		mediaCodecs: [
			{
				kind: "audio",
				mimeType: "audio/opus",
				clockRate: 48000,
				channels: 2,
			},
		] as RtpCodecCapability[],
	},

	// rtp ips are the most important thing, below. you'll need
	// to set these appropriately for your network for the demo to
	// run anywhere but on localhost
	webRtcTransport: {
		listenInfos: [
			{ ip: "192.168.1.126", announcedIp: "192.168.1.126" },
			// {
			// 	ip: ENV_VARS.WEBRTC_LISTEN_IP || "192.168.42.68",
			// 	announcedIp: ENV_VARS.WEBRTC_ANNOUNCEMENT_IP || null,
			// },
			// { ip: "172.17.0.1", announcedIp: undefined },
			// { ip: "127.0.0.1", announcedIp: "192.168.1.34" },
			// { ip: "192.168.42.68", announcedIp: null },
			// { ip: "10.10.23.101", announcedIp: null },
		],
		enableUdp: true,
		enableTcp: true,
		preferUdp: true,
		initialAvailableOutgoingBitrate: 800000,
	} as WebRtcTransportOptions,
};
