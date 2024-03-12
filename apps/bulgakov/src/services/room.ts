import { prisma } from "apps/bulgakov/src/config/prisma";
import { Prisma } from "@prisma/client";

export const Rooms = {
	createRoom: async ({ ...room }: Prisma.RoomCreateArgs["data"], userId: string) => {
		const res = await prisma.room.create({
			data: {
				...room,
				voiceServerId: null,
				peers: {
					create: {
						userId,
						role: "creator",
						isDeafened: false,
						isMuted: false,
						isSpeaker: true,
						askedToSpeak: false,
					},
				},
			},
		});
		return res.id;
	},
	getRoom: async <T extends Prisma.RoomSelect>(
		id: string,
		select: Prisma.Subset<T, Prisma.RoomSelect>
	) => {
		const room = await prisma.room.findUnique<{ select: T; where: { id: string } }>({
			where: { id },
			select,
		});
		if (!room) return Promise.reject("room does not exist");
		return room;
	},
	setVoiceServer: async ({ id, voiceServerId }: { voiceServerId: string; id: string }) =>
		await prisma.room.update({ where: { id }, data: { voiceServerId } }),
	joinRoom: async (id: string, userId: string) =>
		await prisma.peer.create({
			data: {
				userId,
				isDeafened: false,
				isSpeaker: false,
				askedToSpeak: false,
				isMuted: false,
				roomId: id,
			},
			select: {
				askedToSpeak: true,
				isDeafened: true,
				isMuted: true,
				isSpeaker: true,
				role: true,
				user: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
			},
		}),

	leaveRoom: async (userId: string) => await prisma.peer.delete({ where: { userId } }),
	getPeer: async (userId: string) => {
		const peer = await prisma.peer.findUnique({
			where: { userId },
			select: {
				user: {
					select: {
						id: true,
						image: true,
						name: true,
					},
				},
				askedToSpeak: true,
				isDeafened: true,
				isMuted: true,
				isSpeaker: true,
				role: true,
			},
		});
		return peer;
	},
	addSpeaker: async (userId: string) => {
		await prisma.peer.update({ where: { userId }, data: { isSpeaker: true } });
	},
	setAskedToSpeaker: async (userId: string, askedToSpeak: boolean) => {
		await prisma.peer.update({ where: { userId }, data: { askedToSpeak } });
	},
	canManageRoom: async (userId: string) => {
		const res = await prisma.peer.findUnique({ where: { userId }, select: { role: true } });
		return res?.role === "creator";
	},
	delete: async (id: string) => await prisma.room.delete({ where: { id } }),
	setRoomOwner: async (id: string, newOwnerUserId: string) => {
		//Only one creator can exist
		await prisma.peer.updateMany({
			where: {
				roomId: id,
				role: "creator",
			},
			data: {
				role: "member",
			},
		});

		await prisma.peer.update({
			where: { userId: newOwnerUserId, roomId: id },
			data: {
				role: "creator",
			},
		});
	},
};
