import { MapKeysTo } from "@glimmer/types";
import { Rooms, Rabbit, Users, Peers } from "../../services";
import { SOCKET_TOPICS } from "../../constants";
import { z } from "zod";
import { TemplatedApp, WebSocket } from "uWebSockets.js";
import { User, IncomingActions, IncomingActionsPayload, Room, Peer } from "@glimmer/bulgakov";
import { select } from "./helpers";
import { prisma } from "../../config/prisma";

type Handlers = (
	ws: WebSocket<User>,
	app: TemplatedApp
) => {
	[key in IncomingActions]: (payload: IncomingActionsPayload[key]) => void;
};

export const socketHandlers: Handlers = (ws, app) => {
	const sendRoomDoesNotExist = () =>
		ws.sendJson({
			action: "@room:error",
			payload: {
				type: "room-not-found",
				message:
					"The room you are trying to interact with does not exist or you haven't joined",
			},
		});

	return {
		"@room:create": async ({ ...room }) => {
			const user = ws.getUserData();
			try {
				await Room.pick<MapKeysTo<IncomingActionsPayload["@room:create"], true>>({
					name: true,
					description: true,
					isPrivate: true,
					tags: true,
				}).parseAsync(room);
				const roomId = await Rooms.create(room, user.id);
				Rabbit.publishToVoiceServer(null, { op: "@room:create", d: { roomId } });
				ws.subscribe(SOCKET_TOPICS.ROOM(roomId));
			} catch (err) {
				console.error("error while creating room", err);
				ws.sendJson({
					action: "@room:error",
					payload: {
						type: "could-not-create-room",
						message: "There's been an error while creating room",
					},
				});
			}
		},
		"@room:join": async ({ roomId }) => {
			const { id: userId } = ws.getUserData();
			await z.string().parseAsync(roomId);
			const room = await Rooms.get(roomId, {
				voiceServerId: true,
				name: true,
				description: true,
				tags: true,
				peers: {
					where: { userId: { not: userId } },
					select: select.peers.joinRoom,
				},
			});
			if (!room) return sendRoomDoesNotExist();
			const { voiceServerId, peers, name, description, tags } = room;
			// Maybe wants to re-stablish connection so he is already in the room
			let peer = await Peers.get(userId, select.peers.joinRoom);
			if (!peer) peer = await Peers.joinRoom(roomId, userId, select.peers.joinRoom);
			if (!peer.user.image || !peer.user.name)
				return ws.sendJson({
					action: "@room:error",
					payload: {
						type: "basic-profile-not-setup",
						message:
							"You must send your basic profile (name, image) before joining to the room",
					},
				});
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:join",
				d: { roomId, willProduce: peer.isSpeaker, peerId: userId },
			});
			ws.sendJson({
				action: "@room:state",
				payload: {
					room: { name, description, tags, peers },
				},
			});
			await app.broadcastToRoom(roomId, {
				action: "@room:new-peer",
				payload: { peer },
			});
			if (!ws.isSubscribed(SOCKET_TOPICS.ROOM(roomId)))
				ws.subscribe(SOCKET_TOPICS.ROOM(roomId));
		},
		"@room:leave": async () => {
			const { id: userId } = ws.getUserData();
			const { id: roomId, voiceServerId } = await Peers.leaveRoom(userId, {
				id: true,
				voiceServerId: true,
			});
			ws.unsubscribe(SOCKET_TOPICS.ROOM(roomId));
			await app.broadcastToRoom(roomId, {
				action: "@room:peer-left",
				payload: { peerId: userId },
			});
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:leave",
				d: { roomId, peerId: userId },
			});
		},
		"@room:delete": async () => {
			const user = ws.getUserData();
			const { id, voiceServerId } = await prisma.room.delete({
				where: { ownerId: user.id },
				select: { id: true, voiceServerId: true },
			});
			const roomId = id;
			Rabbit.publishToVoiceServer(voiceServerId, {
				op: "@room:delete",
				d: { roomId },
			});
			app.broadcastToRoom(roomId, { action: "@room:deleted", payload: { roomId } });
		},
		"@room:connect-webRtcTransport": async ({ ...rest }) => {
			const user = ws.getUserData();
			const res = await Peers.get(user.id, select.peers.voiceServerId);
			if (!res) return sendRoomDoesNotExist();
			Rabbit.publishToVoiceServer(res.room.voiceServerId, {
				op: "@room:connect-webRtcTransport",
				d: { peerId: user.id, roomId: res.room.id, ...rest },
			});
		},
		"@room:get-recv-tracks": async ({ rtpCapabilities }) => {
			const user = ws.getUserData();
			const res = await Peers.get(user.id, select.peers.voiceServerId);
			if (!res) return sendRoomDoesNotExist();
			Rabbit.publishToVoiceServer(res.room.voiceServerId, {
				op: "@room:get-recv-tracks",
				d: { roomId: res.room.id, peerId: user.id, rtpCapabilities },
			});
		},
		"@room:send-track": async ({ produceParams }) => {
			const user = ws.getUserData();
			const res = await Peers.get(user.id, select.peers.voiceServerId);
			if (!res) return sendRoomDoesNotExist();
			Rabbit.publishToVoiceServer(res.room.voiceServerId, {
				op: "@room:send-track",
				d: { roomId: res.room.id, peerId: user.id, produceParams },
			});
		},
		"@room:resume-consumer": async ({ consumerId }) => {
			const user = ws.getUserData();
			const res = await Peers.get(user.id, select.peers.voiceServerId);
			if (!res) return sendRoomDoesNotExist();
			Rabbit.publishToVoiceServer(res.room.voiceServerId, {
				op: "@room:resume-consumer",
				d: { roomId: res.room.id, peerId: user.id, consumerId },
			});
		},
		"@room:add-speaker": async ({ peerId }) => {
			const user = ws.getUserData();
			await z.string().parseAsync(peerId);
			const { room } = await Peers.changeOtherPeerState(
				user.id,
				peerId,
				{
					isSpeaker: true,
					askedToSpeak: false,
				},
				select.peers.voiceServerId
			);
			Rabbit.publishToVoiceServer(room.voiceServerId, {
				op: "@room:add-producer",
				d: { roomId: room.id, peerId },
			});
			app.broadcastToRoom(room.id, {
				action: "@room:peer-state-changed",
				payload: { peerId, isSpeaker: true },
			});
		},
		"@room:remove-speaker": async ({ peerId }) => {
			const user = ws.getUserData();
			await z.string().parseAsync(peerId);
			const { room } = await Peers.changeOtherPeerState(
				user.id,
				peerId,
				{
					isSpeaker: false,
				},
				select.peers.voiceServerId
			);
			Rabbit.publishToVoiceServer(room.voiceServerId, {
				op: "@room:close-producer",
				d: { roomId: room.id, peerId, kindsToClose: { audio: true } },
			});
			app.broadcastToRoom(room.id, {
				action: "@room:peer-state-changed",
				payload: { peerId, isSpeaker: false },
			});
		},
		"@room:set-my-state": async (data) => {
			const user = ws.getUserData();
			await Peer.pick({ isDeafened: true, askedToSpeak: true, isMuted: true })
				.partial()
				.parseAsync(data);
			const { room, ...rest } = await Peers.setState(user.id, data, {
				isDeafened: data.isDeafened,
				isMuted: data.isMuted,
				isSpeaker: true,
				askedToSpeak: data.askedToSpeak,
				...select.peers.voiceServerId,
			});
			if (rest.isMuted !== undefined && rest.isSpeaker)
				Rabbit.publishToVoiceServer(room.voiceServerId, {
					op: `@room:${data.isMuted ? "pause" : "resume"}-producer`,
					d: { kind: "audio", peerId: user.id, roomId: room.id },
				});
			app.broadcastToRoom(room.id, {
				action: "@room:peer-state-changed",
				payload: { peerId: user.id, ...rest },
			});
		},
		"@room:mute-speaker": async ({ peerId }) => {
			const user = ws.getUserData();
			await z.string().parseAsync(peerId);
			const { room, isSpeaker } = await Peers.changeOtherPeerState(
				user.id,
				peerId,
				{
					isMuted: true,
				},
				{
					...select.peers.voiceServerId,
					isSpeaker: true,
				}
			);
			if (isSpeaker)
				Rabbit.publishToVoiceServer(room.voiceServerId, {
					op: "@room:pause-producer",
					d: { kind: "audio", peerId, roomId: room.id },
				});
			app.broadcastToRoom(room.id, {
				action: "@room:peer-state-changed",
				payload: { peerId: user.id, isMuted: true },
			});
		},
		"@room:change-peer-role": async ({ peerId, role }) => {
			const user = ws.getUserData();
			// can't change role to itself
			// this is to prevent bugs, such as a creator making himself a member without setting another peer as a creator
			if (user.id === peerId) return Promise.reject();
			await z.string().parseAsync(peerId);
			await Peer.pick({ role: true }).parseAsync(role);
			const { roomId } = await Peers.setRole(user.id, peerId, role, { roomId: true });
			app.broadcastToRoom(roomId, {
				action: "@room:peer-role-changed",
				payload: { peerId, role },
			});
			app.broadcastToUser(peerId, { action: "@room:you-have-a-new-role", payload: { role } });
		},
		"@room:kick-out": async ({ peerId }) => {
			const user = ws.getUserData();
			await z.string().parseAsync(peerId);
			const { room } = await Peers.kickOutFromRoom(
				peerId,
				user.id,
				select.peers.voiceServerId
			);
			Rabbit.publishToVoiceServer(room.voiceServerId, {
				op: "@room:leave",
				d: { roomId: room.id, peerId },
			});
			await app.broadcastToRoom(room.id, {
				action: "@room:peer-left",
				payload: { peerId },
			});
		},
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
			ws.sendJson({
				action: "@user:profile-loaded",
				payload: { message: "profile loaded, now you can join rooms" },
			});
		},
	};
};
