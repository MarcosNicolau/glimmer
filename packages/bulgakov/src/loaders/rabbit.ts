import { TemplatedApp } from "uWebSockets.js";
import { Rabbit } from "../services";

export const loadRabbit = async (ws: TemplatedApp) => {
	try {
		await Rabbit.connect();
		await Rabbit.setupConsumers(ws);
		console.log("rabbit connected");
	} catch (err) {
		console.error("could not connect with rabbit", err);
		return Promise.reject(err);
	}
};
