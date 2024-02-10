import { User } from "./user";

export type UserInRoom = User & {
	id: string;
	role: "creator" | "mod" | "speaker" | "listener";
	isDeafened: boolean;
	isMuted?: boolean;
};

export type Room = {
	id: string;
	ownerId: string;
	private?: {
		code: string;
	};
	users: UserInRoom[];
};
