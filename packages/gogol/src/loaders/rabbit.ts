import { ENV_VARS } from "./../config/env";
import * as amqp from "amqplib";
import {
	ConsumeOperationsData,
	ConsumeOperations,
	SendOperations,
	SendOperationsData,
	Send,
	OperationsHandlers,
} from "../types/operations";

export type IncomingQueueMessage<T extends ConsumeOperations> = {
	op: T;
	d: ConsumeOperationsData[T];
	uid: string;
};

export type OutgoingQueueMessage<T extends SendOperations> = {
	op: T;
	d: SendOperationsData[T];
	uid: string;
};

export const startRabbit = async (operationsHandlers: OperationsHandlers) => {
	const res = await amqp.connect(ENV_VARS.RABBIT_URL || "");
	const channel = await res.createChannel();
	const consumeQueue = await channel.assertQueue("gogol_queue");
	const publishQueue = await channel.assertQueue("bulgakov_queue");
	channel.purgeQueue(consumeQueue.queue);

	const send: Send = (d) => {
		channel.sendToQueue(publishQueue.queue, Buffer.from(JSON.stringify(d)));
	};

	const defaultErr = (uid: string) => {
		send<"error">({ op: "error", d: { message: "try again" }, uid });
	};

	channel.consume(
		consumeQueue.queue,
		(msg) => {
			let data: IncomingQueueMessage<ConsumeOperations> | undefined;
			try {
				data = JSON.parse(msg?.content.toString() || "{}");
			} catch (err) {
				defaultErr(data?.uid || "");
			}
			if (data && data.op) {
				if (!operationsHandlers[data.op]) return;
				// @ts-expect-error idk how to solve this, but the code works when passing the handlers :)
				operationsHandlers[data.op](data.d, data.uid, send, defaultErr);
			}
		},
		{ noAck: true }
	);
};
