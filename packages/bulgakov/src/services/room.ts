import { WebSocket } from "uWebSockets.js";
import { IncomingActionsPayload } from "../types/socket";
import { Redis } from "./redis";

export const RoomsManager = (ws: WebSocket<unknown>) => {
	return {
		createRoom: ({ room }: IncomingActionsPayload["@room:create"]) => {},
		joinRoom: () => {},
	};
};
