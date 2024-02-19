import { App as _App } from "@glimmer/http";
import { SOCKET_TOPICS } from "../constants";
import { WebSocket, AppOptions, TemplatedApp } from "uWebSockets.js";

const buildApp = <T extends { publish: TemplatedApp["publish"] }>(
	app: T & Pick<TemplatedApp, "broadcastToRoom" | "broadcastToUser">
): T & Pick<TemplatedApp, "broadcastToRoom" | "broadcastToUser"> => {
	// TODO we need to signal (through rabbit) the others to publish as well
	app.broadcastToRoom = (roomId: string, msg: object) =>
		app.publish(SOCKET_TOPICS.ROOM(roomId), JSON.stringify(msg));
	app.broadcastToUser = (userId: string, msg: object) =>
		app.publish(SOCKET_TOPICS.USER(userId), JSON.stringify(msg));

	return app;
};

/**
 * Attaches the custom methods (sendJson, broadcastToRoom, etc) to the socket.
 * Make sure you run this before using any of them
 */
export const buildSocket = <T extends object>(ws: WebSocket<T>): WebSocket<T> => {
	const myWs = buildApp(ws);
	myWs.sendJson = (msg: object) => ws.send(JSON.stringify(msg));
	return myWs;
};

export const App = (options?: AppOptions) => buildApp(_App(options));
