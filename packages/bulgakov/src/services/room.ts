import { redis } from "../config/redis";
import { REDIS } from "../constants";
import { Room, UserInRoom } from "../types/room";
import { IncomingActionsPayload } from "../types/socket";
import { User } from "../types/user";
import { generateRandomCode } from "../utils/crypto";

type CreateRoomParams = {
	room: Pick<IncomingActionsPayload["@room:create"], "room">["room"] & { id: string };
	owner: User;
};

export const Rooms = {
	createRoom: async ({ room: { isPrivate, ...room }, owner }: CreateRoomParams) => {
		const roomExists = await redis.json.get(REDIS.JSON_PATHS.room(room.id));
		if (roomExists) return Promise.reject("room already exists");
		const _room: Room = {
			...room,
			ownerId: owner.id,
			users: [
				{
					...owner,
					role: "creator",
					isDeafened: false,
					isMuted: false,
					isSpeaker: true,
				},
			],
			voiceServerId: null,
			private: { is: isPrivate, code: isPrivate ? generateRandomCode(6) : "" },
		};
		await redis.json.set(REDIS.JSON_PATHS.room(room.id), "$", _room);
		return room;
	},
	getRoom: async (roomId: string): Promise<Room> => {
		//@ts-expect-error idk
		const room: string | null = await redis.json.get(REDIS.JSON_PATHS.room(roomId));
		if (room) return JSON.parse(room);
		return Promise.reject("room does not exist");
	},
	getRoomVoiceServer: async (roomId: string) => {
		//@ts-expect-error idk
		const id: string | null = await redis.json.get(REDIS.JSON_PATHS.room(roomId), {
			path: "$.voiceServerId",
		});
		if (id) return id;
		return Promise.reject("room does not exist");
	},
	setVoiceServer: async ({
		roomId,
		voiceServerId,
	}: {
		voiceServerId: string;
		roomId: string;
	}) => {
		await redis.json.set(REDIS.JSON_PATHS.room(roomId), "$.voiceServerId", voiceServerId);
	},
	joinRoom: async (roomId: string, user: User): Promise<UserInRoom> => {
		const _user: UserInRoom = {
			...user,
			role: "peer",
			isDeafened: false,
			isSpeaker: false,
		};
		await redis.json.arrAppend(REDIS.JSON_PATHS.room(roomId), "$.users", _user);
		return _user;
	},
	leaveRoom: async (roomId: string, userId: string) => {
		await redis.json.del(REDIS.JSON_PATHS.room(roomId), `users[@.id===${userId}]`);
	},
	getUser: async (roomId: string, userId: string): Promise<UserInRoom | null> => {
		//@ts-expect-error ids are string!
		const user: string[] = await redis.json.get(REDIS.JSON_PATHS.room(roomId), {
			path: `$.users[@.id===${userId}]`,
		});
		if (!user || !user[0]) return null;
		return JSON.parse(user[0]);
	},
	addSpeaker: async (roomId: string, userId: string) => {
		await redis.json.set(
			REDIS.JSON_PATHS.room(roomId),
			`$.users[@.id===${userId}].isSpeaker`,
			true
		);
	},
	canManageRoom: async (roomId: string, userId: string) => {
		const ownerId = await redis.json.get(REDIS.JSON_PATHS.room(roomId), { path: "$.ownerId" });
		return ownerId === userId;
	},
	delete: async (roomId: string) => await redis.json.del(REDIS.JSON_PATHS.room(roomId)),
};
