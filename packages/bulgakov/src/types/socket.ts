import {
	ConsumeParams,
	GogolMsgData,
	GogolOperations,
	TransportDirection,
	WebRtcTransportConnData,
} from "@glimmer/types";
import { Room } from "./room";
import { Auth } from "./auth";
import { WebSocket } from "uWebSockets.js";

export type MyWebSocket = WebSocket<unknown> & {
	sendJson: <T extends OutgoingActions>(msg: OutgoingWsMessage<T>) => void;
	broadcastToRoom: <T extends OutgoingActions>(roomId: string, msg: OutgoingWsMessage<T>) => void;
	broadcastToUser: <T extends OutgoingActions>(userId: string, msg: OutgoingWsMessage<T>) => void;
};

export type IncomingActionsPayload = {
	"@room:join": {
		auth: Auth;
		roomId: string;
	};
	"@room:leave": {
		auth: Auth;
		roomId: string;
	};
	"@room:create": {
		auth: Auth;
		room: {
			name: string;
			description: string;
			feat: string[];
			tags: string[];
			isPrivate: boolean;
		};
	};
	"@room:delete": {
		auth: Auth;
		roomId: string;
	};
	"@room:add-speaker": {
		auth: Auth;
		speakerId: string;
		roomId: string;
	};
	"@room:deafened": {
		auth: Auth;
		roomId: string;
	};
	"@room:mute-speaker": {
		auth: Auth;
		userId: string;
		roomId: string;
	};
	"@room:mute-me": {
		auth: Auth;
	};
	"@room:send-track": {
		auth: Auth;
		roomId: string;
		produceParams: {
			id: string;
			kind: ConsumeParams["kind"];
			rtpParameters: ConsumeParams["rtpParameters"];
			paused: boolean;
		};
	};
	"@room:connect-webRtcTransport": {
		auth: Auth;
		roomId: string;
		direction: TransportDirection;
		dtlsParameters: WebRtcTransportConnData["dtlsParameters"];
	};
};

export type OutgoingActionsPayload = Omit<GogolMsgData, "@room:created"> & {
	"@room:deleted": {
		roomId: string;
	};
	"@room:created": {
		roomId: string;
	};
	"@room:details": {
		room: Pick<Room, "users" | "id">;
	};
	"@room:new-user": {
		userId: string;
	};
	"@room:new-speaker": {
		userId: string;
	};
	"@room:user-deafened": {
		userId: string;
	};
	"@room:user-muted": {
		userId: string;
	};
	"@room:user-left": {
		userId: string;
	};
	"@auth:invalid-token": {
		message: string;
	};
};

export type IncomingActions = keyof IncomingActionsPayload;

export type OutgoingActions = keyof OutgoingActionsPayload | GogolOperations;

export type IncomingWsMessage<T extends IncomingActions> = {
	action: T;
	payload: IncomingActionsPayload[T];
};

export type OutgoingWsMessage<T extends OutgoingActions> = {
	action: T;
	payload: OutgoingActionsPayload[T];
};
