import { IncomingActions, IncomingActionsPayload } from "../../types/socket";
import { Rooms, Rabbit } from "../../services";
import { SOCKET_TOPICS } from "../../constants";
import { z } from "zod";
import { generateRandomId } from "../../utils/crypto";
import { WebSocket } from "uWebSockets.js";
import { User } from "../../types/user";

type Handlers = (ws: WebSocket<User>) => {
	[key in IncomingActions]: (payload: IncomingActionsPayload[key]) => void;
};

export const socketHandlers: Handlers = (ws: WebSocket<User>) => {
	const validateRoom = async (roomId: string) => await z.string().parseAsync(roomId);

	return {
		"@room:create": async ({ room }) => {
			const user = ws.getUserData();
			await z
				.object({
					name: z.string(),
					description: z.string(),
					feat: z.array(z.string()),
					tags: z.array(z.string()),
					isPrivate: z.boolean(),
				})
				.parseAsync(room);
			const roomId = generateRandomId();
			await Rooms.createRoom({ room: { id: roomId, ...room }, owner: user });
			Rabbit.publishToVoiceServer(null, { op: "@room:create", d: { roomId } });
		},
		"@room:join": async ({ roomId }) => {
			const { id: userId, name } = ws.getUserData();
			await validateRoom(roomId);
			const { voiceServerId, users } = await Rooms.getRoom(roomId, [
				"voiceServerId",
				"users[*].id",
			]);
			// Maybe wants to re-stablish connection so he is already in the room
			let user = await Rooms.getUser(roomId, userId);
			if (!user) user = await Rooms.joinRoom(roomId, { id: userId, name });
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:join",
				d: { roomId, willProduce: user.isSpeaker, userId: user.id },
			});
			if (!ws.isSubscribed(SOCKET_TOPICS.ROOM(roomId)))
				ws.subscribe(SOCKET_TOPICS.ROOM(roomId));
			ws.broadcastToUser(userId, {
				action: "@room:details",
				payload: { roomId, room: { id: roomId, users } },
			});
			await ws.broadcastToRoom(roomId, {
				action: "@room:new-user",
				payload: { roomId, userId: user.id },
			});
		},
		"@room:leave": async ({ roomId }) => {
			await validateRoom(roomId);
			const { id: userId } = ws.getUserData();
			ws.unsubscribe(SOCKET_TOPICS.ROOM(roomId));
			ws.broadcastToRoom(roomId, { action: "@room:user-left", payload: { roomId, userId } });
			await Rooms.leaveRoom(roomId, userId);
			const { voiceServerId } = await Rooms.getRoom(roomId, ["voiceServerId"]);
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:leave",
				d: { roomId, userId },
			});
		},
		"@room:send-track": async ({ roomId, produceParams }) => {
			await validateRoom(roomId);
			const user = ws.getUserData();
			const { voiceServerId } = await Rooms.getRoom(roomId, ["voiceServerId"]);
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:send-track",
				d: { roomId, userId: user.id, produceParams },
			});
		},
		"@room:connect-webRtcTransport": async ({ roomId, ...rest }) => {
			const user = ws.getUserData();
			await validateRoom(roomId);
			await z.object({ direction: z.string(), dtlsParameters: z.string() }).parseAsync(rest);
			const { voiceServerId } = await Rooms.getRoom(roomId, ["voiceServerId"]);
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:connect-webRtcTransport",
				d: { userId: user.id, roomId, ...rest },
			});
		},
		"@room:add-speaker": async ({ speakerId, roomId }) => {
			const user = ws.getUserData();
			await validateRoom(roomId);
			// In the future this will be based on the roles
			const canAdd = await Rooms.canManageRoom(roomId, user.id);
			if (!canAdd) return;
			const { voiceServerId } = await Rooms.getRoom(roomId, ["voiceServerId"]);
			await Rooms.addSpeaker(roomId, speakerId);
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:add-producer",
				d: { roomId, userId: speakerId },
			});
			ws.broadcastToRoom(roomId, {
				action: "@room:new-speaker",
				payload: { roomId, userId: speakerId },
			});
		},
		"@room:delete": async ({ roomId }) => {
			const user = ws.getUserData();
			await validateRoom(roomId);
			const canManage = await Rooms.canManageRoom(roomId, user.id);
			if (!canManage) return;
			const { voiceServerId } = await Rooms.getRoom(roomId, ["voiceServerId"]);
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
