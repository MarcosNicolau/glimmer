import { IncomingActions, IncomingActionsPayload, MyWebSocket } from "../../types/socket";
import { Rooms, Rabbit, Token } from "../../services";
import { SOCKET_TOPICS } from "../../constants";
import { Auth } from "../../types/auth";
import { z } from "zod";
import { User } from "../../types/user";
import { generateRandomId } from "../../utils/crypto";

type Handlers = (ws: MyWebSocket) => {
	[key in IncomingActions]: (payload: IncomingActionsPayload[key]) => void;
};

/**
 * @returns token payload
 */
const authMiddleware = async (auth: Auth, ws: MyWebSocket): Promise<{ user: User }> => {
	const { isValid, payload: decoded } = await Token.verify(auth?.token);
	const errInvalidAuth = () =>
		ws.sendJson({ action: "@auth:invalid-token", payload: { message: "invalid token" } });
	if (!isValid) {
		errInvalidAuth();
		return Promise.reject("invalid auth token");
	}
	try {
		const payload = await z
			.object({
				id: z.string(),
				name: z.string(),
			})
			.parseAsync(decoded);
		return { user: payload };
	} catch (err) {
		console.error("invalid payload", err);
		errInvalidAuth();
		return Promise.reject("invalid token payload");
	}
};

export const socketHandlers: Handlers = (ws: MyWebSocket) => {
	const validateRoomId = (roomId: string) => z.string().parseAsync(roomId);
	return {
		"@room:create": async ({ auth, room }) => {
			const { user } = await authMiddleware(auth, ws);
			await z
				.object({
					name: z.string(),
					description: z.string(),
					feat: z.array(z.string()),
					tags: z.array(z.string()),
					isPrivate: z.boolean(),
				})
				.parseAsync(room);
			const roomId = generateRandomId(10);
			await Rooms.createRoom({ room: { id: roomId, ...room }, owner: user });
			Rabbit.publishToVoiceServer(null, { op: "@room:create", d: { roomId } });
		},
		"@room:join": async ({ roomId, auth }) => {
			const { user } = await authMiddleware(auth, ws);
			await validateRoomId(roomId);
			const voiceServerId = await Rooms.getRoomVoiceServer(roomId);
			// Maybe wants to re-stablish connection so he is already in the room
			let roomUser = await Rooms.getUser(roomId, user.id);
			if (!roomUser) roomUser = await Rooms.joinRoom(roomId, user);
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:join",
				d: { roomId, willProduce: roomUser.isSpeaker, userId: roomUser.id },
			});
			if (!ws.isSubscribed(SOCKET_TOPICS.ROOM(roomId)))
				ws.subscribe(SOCKET_TOPICS.ROOM(roomId));
			if (!ws.isSubscribed(SOCKET_TOPICS.USER(roomId)))
				ws.subscribe(SOCKET_TOPICS.USER(user.id));
			ws.broadcastToRoom(roomId, { action: "@room:new-user", payload: { userId: user.id } });
		},
		"@room:leave": async ({ auth, roomId }) => {
			await validateRoomId(roomId);
			const { user } = await authMiddleware(auth, ws);
			ws.unsubscribe(SOCKET_TOPICS.USER(user.id));
			ws.unsubscribe(SOCKET_TOPICS.ROOM(roomId));
			ws.broadcastToRoom(roomId, { action: "@room:user-left", payload: { userId: user.id } });
			await Rooms.leaveRoom(roomId, user.id);
		},
		"@room:send-track": async ({ auth, roomId, produceParams }) => {
			await validateRoomId(roomId);
			const { user } = await authMiddleware(auth, ws);
			const voiceServerId = await Rooms.getRoomVoiceServer(roomId);
			await z.string().parseAsync(roomId);
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:send-track",
				d: { roomId, userId: user.id, produceParams },
			});
		},
		"@room:connect-webRtcTransport": async ({ auth, roomId, ...rest }) => {
			const { user } = await authMiddleware(auth, ws);
			await validateRoomId(roomId);
			await z.object({ direction: z.string(), dtlsParameters: z.string() }).parseAsync(rest);
			const voiceServerId = await Rooms.getRoomVoiceServer(roomId);
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:connect-webRtcTransport",
				d: { userId: user.id, roomId, ...rest },
			});
		},
		"@room:add-speaker": async ({ auth, speakerId, roomId }) => {
			const { user } = await authMiddleware(auth, ws);
			await validateRoomId(roomId);
			// In the future this will be based on the roles
			const canAdd = await Rooms.canManageRoom(roomId, user.id);
			if (!canAdd) return;
			const voiceServerId = await Rooms.getRoomVoiceServer(roomId);
			await Rooms.addSpeaker(roomId, speakerId);
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:add-producer",
				d: { roomId, userId: speakerId },
			});
			ws.broadcastToRoom(roomId, {
				action: "@room:new-speaker",
				payload: { userId: speakerId },
			});
		},
		"@room:delete": async ({ roomId, auth }) => {
			const { user } = await authMiddleware(auth, ws);
			await validateRoomId(roomId);
			const canManage = await Rooms.canManageRoom(roomId, user.id);
			if (!canManage) return;
			const voiceServerId = await Rooms.getRoomVoiceServer(roomId);
			await Rooms.delete(roomId);
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:delete",
				d: { roomId },
			});
			ws.broadcastToRoom(roomId, { action: "@room:deleted", payload: { roomId } });
		},
		// TODO: finish theeeeese
		"@room:deafened": () => {},
		"@room:mute-me": () => {},
		"@room:mute-speaker": () => {},
	};
};
