import { OutgoingActions, OutgoingWsMessage } from "../socket";

declare module "uWebSockets.js" {
	export interface TemplatedApp extends uws.TemplatedApp {
		broadcastToRoom: <T extends OutgoingActions>(
			roomId: string,
			msg: OutgoingWsMessage<T>
		) => void;
		broadcastToUser: <T extends OutgoingActions>(
			userId: string,
			msg: OutgoingWsMessage<T>
		) => void;
	}

	export interface WebSocket extends uws.WebSocket {
		sendJson: <T extends OutgoingActions>(msg: OutgoingWsMessage<T>) => void;
		broadcastToRoom: <T extends OutgoingActions>(
			roomId: string,
			msg: OutgoingWsMessage<T>
		) => void;
		broadcastToUser: <T extends OutgoingActions>(
			userId: string,
			msg: OutgoingWsMessage<T>
		) => void;
	}
}
