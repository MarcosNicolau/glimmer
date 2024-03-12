import { prisma } from "../config/prisma";

export const loadDB = async () => {
	try {
		await prisma.$connect();
		console.log("postgres connected");
	} catch (err: any) {
		return Promise.reject(err);
	}
};
