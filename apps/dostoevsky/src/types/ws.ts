import {
	IncomingActions,
	IncomingWsMessage,
	OutgoingActions,
	OutgoingWsMessage,
} from "@glimmer/bulgakov";

type Listener<Action extends OutgoingActions> = (
	payload: OutgoingWsMessage<Action>["payload"]
) => void;

export interface MyWebSocket extends WebSocket {
	sendJson: <Action extends IncomingActions>(message: IncomingWsMessage<Action>) => void;
	on: <Action extends OutgoingActions>(action: Action, listener: Listener<Action>) => void;
	listeners: {
		[key in OutgoingActions]?: Listener<key>;
	};
	_removeEventListener: WebSocket["removeEventListener"];
	removeEventListener: (action: OutgoingActions) => void;
}
