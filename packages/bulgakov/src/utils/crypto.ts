import crypto from "node:crypto";

export const generateRandomCode = (length = 6) =>
	Math.random()
		.toString()
		.substring(2, length + 2);

export const generateRandomId = (bytes?: number) => crypto.randomBytes(bytes || 20).toString("hex");
