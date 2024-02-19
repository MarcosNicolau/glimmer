import { User } from "./user";

export type UserInRoom = User & {
	role: "creator" | "mod" | "peer";
	joinedAt: number;
	isDeafened: boolean;
	isMuted?: boolean;
	isSpeaker: boolean;
};

export type Room = {
	id: string;
	ownerId: string;
	voiceServerId: string | null;
	createdAt: number;
	private: {
		is: boolean;
		code?: string;
	};
	users: UserInRoom[];
};
