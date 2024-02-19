import {
	ConsumeParams,
	GogolMsgData,
	GogolOperations,
	TransportDirection,
	WebRtcTransportConnData,
} from "@glimmer/types";
import { Room } from "./room";

export type IncomingActionsPayload = {
	"@room:join": {
		roomId: string;
	};
	"@room:leave": {
		roomId: string;
	};
	"@room:create": {
		room: {
			name: string;
			description: string;
			feat: string[];
			tags: string[];
			isPrivate: boolean;
		};
	};
	"@room:delete": {
		roomId: string;
	};
	"@room:add-speaker": {
		speakerId: string;
		roomId: string;
	};
	"@room:deafened": {
		roomId: string;
	};
	"@room:mute-speaker": {
		userId: string;
		roomId: string;
	};
	"@room:mute-me": {
		roomId: string;
	};
	"@room:send-track": {
		roomId: string;
		produceParams: {
			id: string;
			kind: ConsumeParams["kind"];
			rtpParameters: ConsumeParams["rtpParameters"];
			paused: boolean;
		};
	};
	"@room:connect-webRtcTransport": {
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
