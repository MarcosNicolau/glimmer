import { Room, UserInRoom } from "./room";
import { User } from "./user";

export type IncomingActionsPayload = {
	"@room:join": {
		roomId: string;
		user: User;
	};
	"@room:leave": {
		auth: {
			token: string;
		};
	};
	"@room:create": {
		room: {
			name: string;
			description: string;
			feat: string[];
			tags: string[];
		};
	};
	"@room:delete": {
		auth: {
			token: string;
		};
	};
	"@room:add-speaker": {
		auth: {
			token: string;
		};
		userId: string;
	};
	"@room:deafened": {
		auth: {
			token: string;
		};
	};
	"@room:mute-speaker": {
		auth: {
			token: string;
		};
		userId: string;
	};
	"@room:mute-me": {
		auth: {
			token: string;
		};
	};
	"connect-webRtcTransport": {
		auth: {
			token: string;
		};
		roomId: string;
		direction: TransportDirection;
		dtlsParameters: WebRtcTransport["dtlsParameters"];
	};
	"send-track": {
		auth: {
			token: string;
		};
		roomId: string;
		produceParams: {
			id: string;
			kind: MediaKind;
			rtpParameters: RtpParameters;
			paused: boolean;
		};
	};
};

export type OutgoingActionsPayload = {
	"@room:created": {
		// This tokens allows the user to performs owner actions
		token: string;
	};
	"@room:you-joined": {
		// This token will allow the user to perform actions
		token: string;
		room: Pick<Room, "users" | "id">;
		rtpCapabilities: RtpCapabilities;
		recvTransport: WebRtcTransportConnData;
		sendTransport: WebRtcTransportConnData | null;
		consumers: ConsumeParams[];
	};
	"@room:new-user": {
		user: UserInRoom;
	};
	"@room:you-are-now-a-speaker": {
		rtpCapabilities: RtpCapabilities;
		sendTransport: WebRtcTransportConnData;
	};
	"@room:new-speaker": {
		user: UserInRoom;
		consumerParams: ConsumeParams;
	};
	"@room:user-deafened": {
		user: UserInRoom;
	};
	"@room:user-muted": {
		user: UserInRoom;
	};
	"@room:user-left": {
		user: UserInRoom;
	};
};

export type IncomingActions = keyof IncomingActionsPayload;

export type OutgoingActions = keyof OutgoingActionsPayload;

export type IncomingWsMessage<T extends IncomingActions> = {
	action: T;
	payload: IncomingActionsPayload[T];
};

export type OutgoingWsMessage<T extends OutgoingActions> = {
	action: T;
	payload: OutgoingActionsPayload[T];
};
