import dotenv from "dotenv";

dotenv.config();

export const ENV_VARS = {
	NODE_ENV: process.env.NODE_ENV || "dev",
	RABBIT_URL: process.env.RABBIT_URL,
	WEBRTC_LISTEN_IP: process.env.WEBRTC_LISTEN_IP,
	WEBRTC_ANNOUNCEMENT_IP: process.env.WEBRTC_ANNOUNCEMENT_IP,
	SERVER_ID: process.env.SERVER_ID,
} as const;
