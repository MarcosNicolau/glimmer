import { Peer } from "@glimmer/bulgakov";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export const Peers = {
	get: <T extends Prisma.PeerSelect>(
		userId: string,
		select: Prisma.Subset<T, Prisma.PeerSelect>
	) =>
		prisma.peer.findUnique({
			where: { userId },
			select,
		}),
	getRoom: <T extends Prisma.RoomSelect>(
		userId: string,
		select: Prisma.Subset<T, Prisma.RoomSelect>
	) =>
		prisma.peer.findUnique({
			where: { userId },
			select: {
				room: {
					select,
				},
			},
		}),
	joinRoom: <T extends Prisma.PeerSelect>(
		id: string,
		userId: string,
		select: Prisma.Subset<T, Prisma.PeerSelect>
	) =>
		prisma.peer.create({
			data: {
				userId,
				isDeafened: false,
				isSpeaker: false,
				askedToSpeak: false,
				isMuted: false,
				roomId: id,
			},
			select,
		}),
	leaveRoom: async <T extends Prisma.RoomSelect>(
		userId: string,
		roomSelect?: Prisma.Subset<T, Prisma.RoomSelect>
	) => {
		const { role, roomId, room } = await prisma.peer.delete({
			where: { userId },
			select: {
				roomId: true,
				role: true,
				room: roomSelect ? { select: roomSelect } : undefined,
			},
		});
		// transfer ownership if the owner left without deleting the room
		if (role === "owner") {
			const firstJoined = await prisma.peer.findMany({
				// mods take priory
				where: { OR: [{ role: "mod", roomId }, { roomId }] },
				take: 1,
				// also do first joined users
				orderBy: { joinedAt: "asc" },
				select: { userId: true },
			});
			if (firstJoined[0])
				await prisma.peer.update({
					where: { userId: firstJoined[0].userId },
					data: { role: "owner" },
				});
		}

		return room;
	},
	kickOutFromRoom: async <T extends Prisma.PeerSelect>(
		userId: string,
		ownerId: string,
		select: Prisma.Subset<T, Prisma.PeerSelect>
	) =>
		prisma.peer.delete({
			where: { userId, room: { ownerId } },
			select,
		}),
	setState: <T extends Prisma.PeerSelect>(
		userId: string,
		data: Pick<
			Prisma.PeerUpdateArgs["data"],
			"askedToSpeak" | "isSpeaker" | "isDeafened" | "isMuted"
		>,
		select: Prisma.Subset<T, Prisma.PeerSelect>
	) =>
		prisma.peer.update({
			where: { userId },
			data,
			select,
		}),
	// since other user inside the room will change this peer state
	// the adminId is needed, otherwise it would be able to change the state of other users in other rooms
	changeOtherPeerState: <T extends Prisma.PeerSelect>(
		userId: string,
		userToChangeStateId: string,
		data: Pick<
			Prisma.PeerUpdateArgs["data"],
			"askedToSpeak" | "isSpeaker" | "isDeafened" | "isMuted"
		>,
		select: Prisma.Subset<T, Prisma.PeerSelect>
	) =>
		prisma.peer.update({
			where: {
				userId: userToChangeStateId,
				room: {
					peers: {
						some: {
							AND: [{ userId }, { OR: [{ role: "owner" }, { role: "mod" }] }],
						},
					},
				},
			},
			data,
			select,
		}),
	setRole: async <T extends Prisma.PeerSelect>(
		userId: string,
		peerToChangeRoleId: string,
		role: Peer["role"],
		select: Prisma.Subset<T, Prisma.PeerSelect>
	) => {
		const res = await prisma.peer.update({
			where: {
				userId: peerToChangeRoleId,
				room: {
					peers: {
						some: {
							userId,
							// make sure only owner can transfer ownerships
							role: role === "owner" ? "owner" : { in: ["mod", "owner"] },
						},
					},
				},
			},
			data: {
				role,
				room:
					// transfer room ownership
					role === "owner"
						? {
								update: {
									where: {
										ownerId: userId,
									},
									data: {
										ownerId: peerToChangeRoleId,
									},
								},
							}
						: undefined,
			},
			select,
		});
		// there can be only one owner per room
		if (role === "owner")
			await prisma.peer.update({
				where: {
					userId: userId,
				},
				data: {
					role: "member",
				},
			});
		return res;
	},
};
