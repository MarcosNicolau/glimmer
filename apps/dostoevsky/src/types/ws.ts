import {
	IncomingActions,
	IncomingWsMessage,
	OutgoingActions,
	OutgoingActionsPayload,
	OutgoingWsMessage,
} from "@glimmer/bulgakov";

type Listener<Action extends OutgoingActions> = (
	payload: OutgoingWsMessage<Action>["payload"]
) => void;

export interface MyWebSocket extends Omit<WebSocket, "removeEventListener"> {
	sendJson: <Action extends IncomingActions>(message: IncomingWsMessage<Action>) => void;
	/**
	 * send a message and then waits for the response of an action
	 * keep in mind that this will remove any other listener you have for that action.
	 * usually these are called when connecting mediasoup transports
	 */
	sendAndWaitForRes: <A extends IncomingActions, O extends OutgoingActions>(
		message: IncomingWsMessage<A>,
		actionToWaitFor: O
	) => Promise<OutgoingActionsPayload[O]>;
	on: <Action extends OutgoingActions>(action: Action, listener: Listener<Action>) => void;
	listeners: {
		[key in OutgoingActions]?: Listener<key>;
	};
	_removeEventListener: WebSocket["removeEventListener"];
	// If the actionId is not provided, then ir remove all the listeners assigned to that action
	removeEventListener: (action: OutgoingActions) => void;
}
