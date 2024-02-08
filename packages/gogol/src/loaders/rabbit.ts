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

	const errBack = (uid: string) => () => {
		send<"error">({
			op: "error",
			d: {
				message:
					"Unexpected error encountered. This probably means that the server went down and now is up again, please try again",
			},
			uid,
		});
	};

	channel.consume(
		consumeQueue.queue,
		(msg) => {
			let data: IncomingQueueMessage<ConsumeOperations> | undefined;
			try {
				data = JSON.parse(msg?.content.toString() || "{}");
			} catch (err) {
				console.error(`Could not parse msg. ${data}`);
				errBack(data?.uid || Math.random().toString());
			}
			if (data && data.op) {
				if (!operationsHandlers[data.op]) return;
				try {
					operationsHandlers[data.op](
						// @ts-expect-error idk how to solve this, but the code works when passing the handlers :)
						data.d,
						data.uid,
						send,
						errBack(data.uid)
					);
				} catch (err) {
					console.error(`Operation ${data.op} failed`, err);
				}
			}
		},
		{ noAck: true }
	);
};
