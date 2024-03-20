import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

export const Rooms = {
	create: async ({ ...room }: Omit<Prisma.RoomCreateArgs["data"], "ownerId">, userId: string) => {
		// users can have only one room at a time!
		await prisma.room.deleteMany({ where: { peers: { some: { role: "owner", userId } } } });
		const res = await prisma.room.create({
			data: {
				...room,
				voiceServerId: null,
				ownerId: userId,
				peers: {
					create: {
						userId,
						role: "owner",
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
	get: async <T extends Prisma.RoomSelect>(
		id: string,
		select: Prisma.Subset<T, Prisma.RoomSelect>
	) => {
		const room = await prisma.room.findUnique<{ select: T; where: { id: string } }>({
			where: { id },
			select,
		});
		return room;
	},
	getWithCursor: async <T extends Prisma.RoomSelect>(
		take: number,
		cursor: string,
		select: Prisma.Subset<T, Prisma.RoomSelect>
	) => {
		const isCursor = cursor !== "0";
		const rooms = await prisma.room.findMany({
			where: { isPrivate: false },
			cursor: isCursor ? { id: cursor } : undefined,
			take: take + 1,
			select,
			orderBy: { peers: { _count: "desc" } },
			skip: isCursor ? 1 : 0,
		});

		return {
			rooms: rooms,
			//@ts-expect-error we are always querying the id
			nextCursor: rooms[rooms.length - 1]?.id,
		};
	},
	setVoiceServer: async ({ id, voiceServerId }: { voiceServerId: string; id: string }) =>
		await prisma.room.update({ where: { id }, data: { voiceServerId } }),
	delete: async (id: string) => await prisma.room.delete({ where: { id } }),
	deleteMany: async (where: Prisma.RoomDeleteManyArgs["where"]) =>
		await prisma.room.deleteMany({ where }),
};
