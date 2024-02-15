import { User } from "./user";

export type UserInRoom = User & {
	role: "creator" | "mod" | "peer";
	isDeafened: boolean;
	isMuted?: boolean;
	isSpeaker: boolean;
};

export type Room = {
	id: string;
	ownerId: string;
	voiceServerId: string | null;
	private: {
		is: boolean;
		code?: string;
	};
	users: UserInRoom[];
};
