import { Rooms, Rabbit, Users } from "../../services";
import { SOCKET_TOPICS } from "../../constants";
import { z } from "zod";
import { WebSocket } from "uWebSockets.js";
import { User, IncomingActions, IncomingActionsPayload } from "@glimmer/bulgakov";

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
			const roomId = await Rooms.createRoom(room, user.id);
			Rabbit.publishToVoiceServer(null, { op: "@room:create", d: { roomId } });
		},
		"@room:join": async ({ roomId }) => {
			const { id: userId } = ws.getUserData();
			await validateRoom(roomId);
			const { voiceServerId, peers } = await Rooms.getRoom(roomId, {
				voiceServerId: true,
				peers: {
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
				},
			});
			// Maybe wants to re-stablish connection so he is already in the room
			let peer = await Rooms.getPeer(userId);
			if (!peer) peer = await Rooms.joinRoom(roomId, userId);
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:join",
				d: { roomId, willProduce: peer.isSpeaker, userId: peer.user.id },
			});
			if (!ws.isSubscribed(SOCKET_TOPICS.ROOM(roomId)))
				ws.subscribe(SOCKET_TOPICS.ROOM(roomId));
			ws.broadcastToUser(userId, {
				action: "@room:details",
				payload: { roomId, room: { id: roomId, peers } },
			});
			await ws.broadcastToRoom(roomId, {
				action: "@room:new-user",
				payload: { roomId, userId: peer.user.id },
			});
		},
		"@room:leave": async ({ roomId }) => {
			await validateRoom(roomId);
			const { id: peerId } = ws.getUserData();
			ws.unsubscribe(SOCKET_TOPICS.ROOM(roomId));
			ws.broadcastToRoom(roomId, {
				action: "@room:user-left",
				payload: { roomId, userId: peerId },
			});
			await Rooms.leaveRoom(peerId);
			const { voiceServerId } = await Rooms.getRoom(roomId, { voiceServerId: true });
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:leave",
				d: { roomId, userId: peerId },
			});
		},
		"@room:send-track": async ({ roomId, produceParams }) => {
			await validateRoom(roomId);
			const user = ws.getUserData();
			const { voiceServerId } = await Rooms.getRoom(roomId, { voiceServerId: true });
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:send-track",
				d: { roomId, userId: user.id, produceParams },
			});
		},
		"@room:connect-webRtcTransport": async ({ roomId, ...rest }) => {
			const user = ws.getUserData();
			await validateRoom(roomId);
			await z.object({ direction: z.string(), dtlsParameters: z.string() }).parseAsync(rest);
			const { voiceServerId } = await Rooms.getRoom(roomId, { voiceServerId: true });
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:connect-webRtcTransport",
				d: { userId: user.id, roomId, ...rest },
			});
		},
		"@room:add-speaker": async ({ speakerId, roomId }) => {
			const user = ws.getUserData();
			await validateRoom(roomId);
			// In the future this will be based on the roles
			const canAdd = await Rooms.canManageRoom(user.id);
			if (!canAdd) return;
			const { voiceServerId } = await Rooms.getRoom(roomId, { voiceServerId: true });
			await Rooms.addSpeaker(speakerId);
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
			const canManage = await Rooms.canManageRoom(user.id);
			if (!canManage) return;
			const { voiceServerId } = await Rooms.getRoom(roomId, { voiceServerId: true });
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
		"@user:send-profile": async ({ user }) => {
			const { id } = ws.getUserData();
			const { links, ...rest } = await User.omit({
				id: true,
				room: true,
				roomId: true,
			}).parseAsync(user);
			await Users.update(id, {
				...rest,
				links: {
					createMany: {
						data: links,
					},
				},
			});
		},
	};
};
