import { OutgoingActions, OutgoingWsMessage } from "@glimmer/bulgakov";
import { MyWebSocket } from "apps/dostoevsky/src/types/ws";

export const getWebSocket = (
	url: string,
	protocols: string[] | string | undefined
): MyWebSocket => {
	//@ts-expect-error complains about the missing fns but we are setting them below
	const myWs: MyWebSocket = new WebSocket(url, protocols);

	myWs.sendJson = (value) => myWs.send(JSON.stringify(value));
	myWs.listeners = {};
	myWs.on = (action, listener) => {
		//@ts-expect-error idk but this works!
		myWs.listeners[action] = listener;
	};
	myWs.sendAndWaitForRes = (message, actionToWaitFor) =>
		new Promise((resolve) => {
			myWs.sendJson(message);
			myWs.on(actionToWaitFor, (payload) => {
				myWs.removeEventListener(actionToWaitFor);
				resolve(payload);
			});
		});
	myWs.addEventListener("message", <T extends OutgoingActions>(e: MessageEvent) => {
		const data: OutgoingWsMessage<T> = JSON.parse(e.data || "{}");

		const listener = myWs.listeners[data?.action];
		if (listener) listener(data.payload || {});
	});
	myWs._removeEventListener = myWs.removeEventListener;
	myWs.removeEventListener = (action: OutgoingActions) => {
		delete myWs.listeners[action];
	};

	return myWs;
};
