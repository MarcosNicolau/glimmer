import {
	GetOnlineUsersCount,
	GetOnlineUsers,
	GetOnlineUsersQueryParams,
	GetTokenRes,
	GetUser,
	GetRooms,
	GetRoomsQueryParams,
	GetRoom,
} from "@glimmer/bulgakov";
import { Rooms, Token, Users } from "../../../services";
import { generateRandomId } from "../../../utils/crypto";
import { HttpHandler } from "uWebSockets.js";
import { zodParseAsync } from "../../..//utils/zod";

export const getToken: HttpHandler = async (res) => {
	const id = generateRandomId();
	const { token } = await Token.issue({ id });
	res.send<GetTokenRes>({ status: 200, result: { token } });
};

export const getUser: HttpHandler = async (res, req) => {
	const id: string = req.getParameter(0);
	if (!id) return res.send({ status: 500, message: "you need to provide an id" });

	try {
		const user = await Users.get(id, {
			name: true,
			image: true,
			description: true,
			links: true,
		});
		if (!user) return res.send({ status: 404, message: "user not found" });
		return res.send<GetUser>({ status: 200, result: user });
	} catch (err) {
		console.error("error while getting user", err);
		return res.send({ status: 500 });
	}
};

export const getOnlineUsers: HttpHandler = async (res, req) => {
	const params: GetOnlineUsersQueryParams = req.params;
	const { err } = await zodParseAsync(GetOnlineUsersQueryParams, params);
	if (err) return res.send({ status: 400, message: err.message });

	try {
		const { nextCursor, users } = await Users.getOnlineUsers(
			Number(params.size),
			params.cursor
		);

		return res.send<GetOnlineUsers>({
			status: 200,
			result: {
				users,
				nextCursor,
			},
		});
	} catch (err) {
		console.error("error while getting online users", err);
		return res.send({ status: 500 });
	}
};

export const getOnlineUsersCount: HttpHandler = async (res) => {
	try {
		const count = await Users.count();
		return res.send<GetOnlineUsersCount>({ status: 200, result: { count } });
	} catch (err) {
		console.error("err while getting online users", err);
		return res.send({ status: 500 });
	}
};

export const getRooms: HttpHandler = async (res, req) => {
	const { cursor, size }: { cursor: string; size: string } = req.params;
	const { err } = await zodParseAsync(GetRoomsQueryParams, { cursor, size });
	if (err) return res.send({ status: 400, message: err.message });

	try {
		const { rooms, nextCursor } = await Rooms.getRooms(Number(size), cursor, {
			id: true,
			name: true,
			description: true,
			tags: true,
			peers: {
				where: { isSpeaker: true },
				select: {
					user: {
						select: {
							id: true,
							image: true,
							name: true,
						},
					},
				},
			},
			_count: { select: { peers: true } },
		});
		// I hate that we can't map fields in prisma like we would do with AS
		// Maybe it would be wiser to do the raw query for performance
		const mappedRooms: GetRooms["rooms"] = rooms.map((room) => ({
			id: room.id,
			name: room.name,
			description: room.description,
			tags: room.tags,
			numOfPeers: room._count.peers,
			speakers: room.peers.map((peer) => peer.user),
		}));

		return res.send<GetRooms>({
			status: 200,
			result: {
				rooms: mappedRooms,
				nextCursor,
			},
		});
	} catch (err: any) {
		if (err.message === "room does not exist")
			return res.send({ status: 404, message: err.message });
		console.error("error while getting room feed", err);
		return res.send({ status: 500 });
	}
};

export const getRoom: HttpHandler = async (res, req) => {
	const id = req.getQuery("0");
	if (!id)
		return res.send({ status: 400, message: "you must provide the room id in the url query" });
	try {
		const room = await Rooms.getRoom(id, {
			id: true,
			name: true,
			description: true,
			tags: true,
			peers: {
				where: { isSpeaker: true },
				select: {
					user: {
						select: {
							id: true,
							image: true,
							name: true,
						},
					},
				},
			},
		});
		return res.send<GetRoom>({
			status: 200,
			result: {
				id: room.id,
				name: room.name,
				description: room.description,
				tags: room.tags,
				numOfPeers: room.peers.length,
				speakers: room.peers.map((peer) => peer.user),
			},
		});
	} catch (err: any) {
		if (err.message === "room does not exist")
			return res.send({ status: 404, message: err.message });
		console.error("error while getting room feed", err);
		return res.send({ status: 500 });
	}
};
