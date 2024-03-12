import { prisma } from "apps/bulgakov/src/config/prisma";
import { Prisma, User } from "@prisma/client";
import { GetOnlineUsers } from "@glimmer/bulgakov";

export const Users = {
	create: async (user: Partial<Omit<Prisma.UserCreateArgs["data"], "peer" | "peerId">>) => {
		const userExists = await prisma.user.findUnique({ where: { id: user.id }, select: {} });
		if (userExists) return;
		return prisma.user.create({
			data: {
				name: user.name || "",
				description: user.description || "",
				image: user.image || "",
				...user,
			},
		});
	},
	remove: (id: string) => prisma.user.delete({ where: { id } }),
	get: async <T extends Prisma.UserSelect>(
		id: string,
		select: Prisma.Subset<T, Prisma.UserSelect>
	) => {
		const user = await prisma.user.findUnique<{ select: T; where: { id: string } }>({
			where: { id },
			select,
		});
		if (!user) return null;
		return user;
	},
	update: async (id: string, data: Partial<Omit<User, "peerId" | "createdAt">>) =>
		prisma.user.update({ where: { id }, data }),
	count: () => prisma.user.count(),
	getOnlineUsers: async (take: number, cursor: string): Promise<GetOnlineUsers> => {
		const query = await prisma.user.findMany({
			cursor: cursor
				? {
						id: cursor,
					}
				: undefined,
			take,
			select: {
				id: true,
				name: true,
				image: true,
				peer: {
					select: {
						room: {
							select: {
								name: true,
								id: true,
								_count: { select: { peers: true } },
							},
						},
					},
				},
			},
			orderBy: { createdAt: "desc" },
			skip: cursor ? 1 : 0,
		});
		const users = query.map<GetOnlineUsers["users"][0]>((val) => ({
			id: val.id,
			name: val.name,
			image: val.image,
			room: !val.peer
				? null
				: {
						id: val.peer.room.id,
						name: val.peer.room.name,
						connectedUsers: val.peer.room._count.peers,
					},
		}));
		return {
			users,
			nextCursor: users[users.length - 1].id,
		};
	},
};
