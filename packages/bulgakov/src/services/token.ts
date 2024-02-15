import jwt from "jsonwebtoken";
import fs from "fs";

export const Token = {
	issue: async (payload: jwt.JwtPayload) => {
		try {
			const cert = await fs.promises.readFile("./jwtRS256.key");
			const token = jwt.sign(payload, cert, {
				algorithm: "RS256",
				issuer: "@glimmer/bulgakov",
			});
			return { token };
		} catch (err) {
			return Promise.reject(err);
		}
	},

	verify: async (token: string) => {
		try {
			const cert = await fs.promises.readFile("./jwt.key.pub");
			let isValid = false;
			let payload: string | jwt.JwtPayload | undefined;
			jwt.verify(token, cert, (err, decoded) => {
				if (!err) isValid = true;
				payload = decoded;
			});
			return { isValid, payload };
		} catch (err) {
			return Promise.reject(err);
		}
	},
};
