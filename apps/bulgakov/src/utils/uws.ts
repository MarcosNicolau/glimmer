import { App as _App } from "@glimmer/http";
import { SOCKET_TOPICS } from "../constants";
import { WebSocket, AppOptions, TemplatedApp } from "uWebSockets.js";
import { Rabbit } from "../services";

const buildApp = <
	T extends Pick<TemplatedApp, "publish" | "broadcastToRoom" | "broadcastToUser"> & object,
>(
	app: T
): T => {
	app.broadcastToRoom = async (roomId, msg) => {
		// Signal the others to publish as well
		await Rabbit.publishToBulgakovExchange({ roomId, msg });
		return app.publish(SOCKET_TOPICS.ROOM(roomId), JSON.stringify(msg));
	};
	app.broadcastToUser = (userId, msg) =>
		app.publish(`${SOCKET_TOPICS.USER(userId)}`, JSON.stringify(msg));

	return app;
};

/**
 * Attaches the custom methods to the socket.
 * Make sure you run this before using any of them
 */
export const buildSocket = <T extends object>(ws: WebSocket<T>) => {
	ws.sendJson = (msg) => ws.send(JSON.stringify(msg));
	return;
};

export const App = (options?: AppOptions) => buildApp(_App(options));
