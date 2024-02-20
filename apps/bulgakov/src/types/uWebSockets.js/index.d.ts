import { OutgoingActions, OutgoingWsMessage } from "../socket";

declare module "uWebSockets.js" {
	export interface TemplatedApp extends uws.TemplatedApp {
		broadcastToRoom: <T extends OutgoingActions>(
			roomId: string,
			msg: OutgoingWsMessage<T>
		) => Promise<boolean>;
		broadcastToUser: <T extends OutgoingActions>(
			userId: string,
			msg: OutgoingWsMessage<T>
		) => boolean;
	}

	export interface WebSocket extends uws.WebSocket {
		sendJson: <T extends OutgoingActions>(msg: OutgoingWsMessage<T>) => void;
		broadcastToRoom: <T extends OutgoingActions>(
			roomId: string,
			msg: OutgoingWsMessage<T>
		) => Promise<boolean>;
		broadcastToUser: <T extends OutgoingActions>(
			userId: string,
			msg: OutgoingWsMessage<T>
		) => boolean;
	}
}
