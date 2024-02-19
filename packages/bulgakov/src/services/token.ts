import * as jwt from "jsonwebtoken";
import * as fs from "fs";

export const Token = {
	issue: async (payload: jwt.JwtPayload) => {
		try {
			const cert = await fs.promises.readFile("./jwtRS256.key");
			const token = await new Promise<string>((resolve, reject) =>
				jwt.sign(
					payload,
					cert,
					{
						algorithm: "RS256",
						issuer: "@glimmer/bulgakov",
					},
					(err, encoded) => {
						if (!encoded || err) reject(err);
						//@ts-expect-error we are checking if its undefined above, wtf typescript :|
						return resolve(encoded);
					}
				)
			);
			return { token };
		} catch (err) {
			return Promise.reject(err);
		}
	},

	verify: async (token: string) => {
		try {
			const cert = await fs.promises.readFile("./jwt.key.pub");
			const { isValid, payload } = await new Promise<{
				isValid: boolean;
				payload: string | jwt.JwtPayload | undefined;
			}>((resolve) =>
				jwt.verify(token, cert, (err, decoded) => {
					resolve({
						isValid: !!err,
						payload: decoded,
					});
				})
			);
			return { isValid, payload };
		} catch (err) {
			return Promise.reject(err);
		}
	},
};
