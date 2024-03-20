import { HttpRequest as Request } from "@glimmer/http";
import { OutgoingActions, OutgoingWsMessage } from "@glimmer/bulgakov";

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
	}

	export interface HttpRequest extends Request {
		user: {
			id: string;
		};
	}
}
