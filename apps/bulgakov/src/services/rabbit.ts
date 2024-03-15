import { Channel, ConsumeMessage, connect } from "amqplib";
import { ENV_VARS } from "../config/env";
import {
	BulgakovOperations,
	BulgakovMessage,
	GogolMsgData,
	GogolOperations,
	GogolMessage,
	broadcastToRoomOps,
	BroadcastToRoomOps,
	BroadcastToUserOps,
} from "@glimmer/gogol";
import { RABBIT } from "@glimmer/constants";
import { Rooms } from "./room";
import { TemplatedApp } from "uWebSockets.js";
import { OutgoingActions, OutgoingWsMessage } from "@glimmer/bulgakov";
import { generateRandomString } from "../utils/crypto";

export const RabbitService = (appId: string) => {
	let channel: Channel | null = null;

	return {
		connect: async () => {
			const conn = await connect(ENV_VARS.RABBIT_URL || "");
			channel = await conn.createChannel();
		},
		consume: (queue: string, handler: (msg: ConsumeMessage | null) => void) => {
			if (!channel) return;
			channel.consume(queue, handler);
		},
		setupConsumers: async (ws: TemplatedApp) => {
			if (!channel) return;
			channel.prefetch(1);
			const { queue: bulgakovQueue } = await channel.assertQueue(
				RABBIT.QUEUES.BULGAKOV_SERVER
			);
			// This queue is used as Pub/Sub for signaling internally between the bulgakov servers.
			// We are using this when broadcasting to the rooms.
			const { queue: internalQueue } = await channel.assertQueue("", {
				exclusive: true,
			});
			const { exchange } = await channel.assertExchange(
				RABBIT.EXCHANGES.INTERNAL_BULGAKOV,
				"fanout",
				{
					durable: false,
				}
			);
			await channel.bindQueue(internalQueue, exchange, "");
			channel.consume(internalQueue, (msg) => {
				if (msg?.properties.appId === appId) return;
				let data: OutgoingWsMessage<
					Exclude<OutgoingActions, "@auth:invalid-token" | "@room:create-error" | "error">
				> | null = null;
				try {
					data = JSON.parse(msg?.content.toString() || "{}");
				} catch (err) {
					console.error(`Could not parse internal msg. ${err}`);
					return;
				}
				if (!data || !data.payload?.roomId || !data.action) return;
				ws.broadcastToRoom(data.payload.roomId, data);
			});
			channel.consume(bulgakovQueue, async (msg) => {
				let data: GogolMessage<GogolOperations> | null = null;
				try {
					data = JSON.parse(msg?.content.toString() || "{}");
				} catch (err) {
					console.error(`Could not parse gogol msg. ${err}`);
					return;
				}
				console.log("consuming bulgakov", data);

				if (!data || !data.op) return;
				try {
					switch (data.op) {
						case "@room:created":
							const { roomId, serverId } = data.d as GogolMsgData["@room:created"];
							await Rooms.setVoiceServer({ id: roomId, voiceServerId: serverId });
							ws.broadcastToRoom(roomId, {
								action: "@room:created",
								payload: { roomId },
							});
							break;
						case "error":
							console.warn("Gogol error operation", data);
							break;
						default:
							const broadcastToRoom = broadcastToRoomOps.find(
								(op) => op === data?.op
							);
							if (broadcastToRoom) {
								const d = data.d as GogolMsgData[BroadcastToRoomOps];
								ws.broadcastToRoom(d.roomId, { action: data.op, payload: d });
							} else {
								const d = data.d as GogolMsgData[BroadcastToUserOps];
								ws.broadcastToUser(d.userId, { action: data.op, payload: d });
							}
							break;
					}
				} catch (err) {
					console.error("error while consuming", err);
				}
			});
		},
		/**
		 * @param id if not provided, it will send the message to the general voice server queue so that one will handle it.
		 */
		publishToVoiceServer: async <T extends BulgakovOperations>(
			id: string | null,
			msg: BulgakovMessage<T>
		) => {
			if (!channel) return;
			const _msg = Buffer.from(JSON.stringify(msg));
			if (id) {
				const { queue } = await channel.assertQueue(RABBIT.QUEUES.VOICE_SERVER(id));
				channel.sendToQueue(queue, _msg, { appId });
				return;
			}
			const { queue } = await channel.assertQueue(RABBIT.QUEUES.GENERAL_VOICE_SERVER);
			channel.sendToQueue(queue, _msg, { appId });
		},
		publishToBulgakovExchange: async <T extends OutgoingActions>(msg: OutgoingWsMessage<T>) => {
			if (!channel) return;
			const { exchange } = await channel.assertExchange(
				RABBIT.EXCHANGES.INTERNAL_BULGAKOV,
				"fanout",
				{
					durable: false,
				}
			);
			channel.publish(exchange, "", Buffer.from(JSON.stringify(msg)), { appId });
		},
		send: async (queue: string, msg: object) => {
			if (!channel) return;
			// make sure it exists
			const { queue: _queue } = await channel.assertQueue(queue);
			channel.sendToQueue(_queue, Buffer.from(JSON.stringify(msg)));
		},
		channel,
	};
};

export const Rabbit = RabbitService(generateRandomString());
