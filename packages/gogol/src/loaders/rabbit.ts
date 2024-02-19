import { ENV_VARS } from "./../config/env";
import * as amqp from "amqplib";
import { Send, OperationsHandlers } from "../types/operations";
import { BulgakovMsgData, BulgakovOperations, BulgakovQueueMessage } from "@glimmer/types";

export type IncomingQueueMessage<T extends BulgakovOperations> = {
	op: T;
	d: BulgakovMsgData[T];
	uid: string;
};

const onMessage = (
	msg: amqp.ConsumeMessage | null,
	handlers: OperationsHandlers,
	send: Send,
	errBack: () => void
) => {
	let data: BulgakovQueueMessage<BulgakovOperations> | undefined;
	try {
		data = JSON.parse(msg?.content.toString() || "{}");
	} catch (err) {
		console.error(`Could not parse msg. ${data}`);
		errBack();
		return;
	}
	if (data && data.op) {
		if (!handlers[data.op]) return;
		try {
			handlers[data.op](
				// @ts-expect-error idk how to solve this, but the code works when passing the handlers :)
				data.d,
				send,
				errBack
			);
		} catch (err) {
			console.error(`Operation ${data.op} failed`, err);
		}
	}
};

export const startRabbit = async (handlers: OperationsHandlers) => {
	const res = await amqp.connect(ENV_VARS.RABBIT_URL || "");
	const channel = await res.createChannel();
	const generalVoiceQueue = await channel.assertQueue("gogol_queue");
	const voiceServerQueue = await channel.assertQueue(`gogol_queue/${ENV_VARS.SERVER_ID}`);
	const publishQueue = await channel.assertQueue("bulgakov_queue");
	channel.purgeQueue(voiceServerQueue.queue);
	channel.prefetch(1);

	const send: Send = (d) => {
		channel.sendToQueue(publishQueue.queue, Buffer.from(JSON.stringify(d)));
	};

	const errBack = () => () => {
		send({
			op: "error",
			d: {
				message: "unexpected-error",
				description:
					"Unexpected error encountered. This probably means that the server went down and now is up again, please try again",
			},
		});
	};

	// Only create room operations should be sent to this queue, so that the rooms is assigned a voice server
	channel.consume(generalVoiceQueue.queue, (msg) => onMessage(msg, handlers, send, errBack), {
		noAck: true,
	});

	// All subsequent room related request should come to this one
	channel.consume(voiceServerQueue.queue, (msg) => onMessage(msg, handlers, send, errBack), {
		noAck: true,
	});

	return channel;
};
