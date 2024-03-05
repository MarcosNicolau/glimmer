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
	myWs.addEventListener(
		"message",
		<T extends OutgoingActions>(e: MessageEvent<OutgoingWsMessage<T>>) => {
			const listener = myWs.listeners[e.data?.action];
			if (listener) listener(e.data.payload);
		}
	);

	return myWs;
};
