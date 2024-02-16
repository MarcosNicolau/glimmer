import { Rabbit } from "../services";
import { MyWebSocket } from "../types/socket";

export const loadRabbit = async (ws: Pick<MyWebSocket, "broadcastToRoom" | "broadcastToUser">) => {
	try {
		await Rabbit.connect();
		Rabbit.setupConsumers(ws);
		console.log("rabbit connected");
	} catch (err) {
		console.error("could not connect with rabbit", err);
		return Promise.reject(err);
	}
};
