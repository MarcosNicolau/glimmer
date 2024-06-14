import {
	ConsumeParams,
	GogolMsgData,
	TransportDirection,
	WebRtcTransportConnData,
} from "@glimmer/gogol";
import { User, Room, Peer } from "../entities";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";

export type IncomingActionsPayload = {
	"@room:join": {
		roomId: string;
	};
	"@room:leave": object;
	"@room:create": {
		name: string;
		description: string;
		tags: string[];
		isPrivate: boolean;
	};
	"@room:delete": object;
	"@room:set-my-state": Partial<Pick<Peer, "askedToSpeak" | "isDeafened" | "isMuted">>;
	"@room:add-speaker": {
		peerId: string;
	};
	"@room:remove-speaker": {
		peerId: string;
	};
	"@room:mute-speaker": {
		peerId: string;
		roomId: string;
	};
	"@room:change-peer-role": {
		peerId: string;
		role: Peer["role"];
	};
	"@room:resume-consumer": {
		consumerId: string;
	};
	"@room:connect-webRtcTransport": {
		direction: TransportDirection;
		dtlsParameters: WebRtcTransportConnData["dtlsParameters"];
	};
	"@room:get-recv-tracks": {
		rtpCapabilities: RtpCapabilities;
	};
	"@room:send-track": {
		produceParams: {
			kind: ConsumeParams["kind"];
			rtpParameters: ConsumeParams["rtpParameters"];
			paused: boolean;
		};
	};
	"@room:kick-out": {
		peerId: string;
	};
	"@user:send-profile": {
		user: Partial<Omit<User, "id">>;
	};
};

export type OutgoingActionsPayload = Omit<
	// error message are internal only communication
	{ [key in Exclude<keyof GogolMsgData, "error">]: GogolMsgData[key] },
	"@room:created" | "@room:deleted"
> & {
	"@room:created": {
		roomId: string;
	};
	"@room:deleted": object;
	"@room:error": {
		type:
			| "room-not-found"
			| "could-not-create-room"
			| "voice-server-down"
			| "basic-profile-not-setup";
		message: string;
	};
	"@room:state": {
		room: Pick<Room, "name" | "description" | "tags" | "peers">;
	};
	"@room:new-peer": {
		peer: Room["peers"][0];
	};
	"@room:peer-state-changed": Partial<
		Pick<Peer, "askedToSpeak" | "isDeafened" | "isMuted" | "isSpeaker">
	> & {
		peerId: string;
	};
	"@room:peer-left": {
		peerId: string;
	};
	"@room:peer-role-changed": {
		peerId: string;
		role: Peer["role"];
	};
	"@room:you-have-a-new-role": {
		role: Peer["role"];
	};
	"@auth:invalid-token": {
		message: string;
	};
	"@user:profile-loaded": {
		message: string;
	};
	error: {
		message: string;
		description: string;
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
