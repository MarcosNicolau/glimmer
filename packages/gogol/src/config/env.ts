import dotenv from "dotenv";

dotenv.config();

export const ENV_VARS = {
	NODE_ENV: process.env.NODE_ENV || "dev",
	RABBIT_URL: process.env.AMQP_URL,
	WEBRTC_LISTEN_IP: process.env.WEBRTC_LISTEN_IP,
	WEBRTC_ANNOUNCEMENT_IP: process.env.WEBRTC_ANNOUNCEMENT_IP,
} as const;
