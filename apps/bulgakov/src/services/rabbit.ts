import { Channel, ConsumeMessage, connect } from "amqplib";
import { ENV_VARS } from "../config/env";
import {
	BulgakovOperations,
	BulgakovQueueMessage,
	GogolMsgData,
	GogolOperations,
	GogolQueueMessage,
	broadcastToRoomOps,
	BroadcastToRoomOps,
	BroadcastToUserOps,
} from "@glimmer/types";
import { RABBIT } from "@glimmer/constants";
import { Rooms } from "./room";
import { TemplatedApp } from "uWebSockets.js";

export const RabbitService = () => {
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
			channel.consume(bulgakovQueue, async (msg: any) => {
				let data: GogolQueueMessage<GogolOperations> | null = null;
				try {
					data = JSON.parse(msg?.content.toString() || "{}");
				} catch (err) {
					console.error(`Could not parse gogol msg. ${err}`);
					return;
				}
				if (!data || !data.op) return;
				try {
					switch (data.op) {
						case "@room:created":
							const { roomId, serverId } = data.d as GogolMsgData["@room:created"];
							await Rooms.setVoiceServer({ roomId, voiceServerId: serverId });
							ws.broadcastToRoom(roomId, {
								action: "@room:created",
								payload: { roomId },
							});
							break;
						case "error":
							console.warn("Gogol error operation", data);
							break;
						default:
							//@ts-expect-error idk why but it takes data as null, when is not
							const broadcastToRoom = broadcastToRoomOps.find((op) => op === data.op);
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
			msg: BulgakovQueueMessage<T>
		) => {
			if (!channel) return;
			const _msg = Buffer.from(JSON.stringify(msg));
			if (id) {
				const { queue } = await channel.assertQueue(RABBIT.QUEUES.VOICE_SERVER(id));
				channel.sendToQueue(queue, _msg);
				return;
			}
			const { queue } = await channel.assertQueue(RABBIT.QUEUES.GENERAL_VOICE_SERVER);
			channel.sendToQueue(queue, _msg);
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

export const Rabbit = RabbitService();