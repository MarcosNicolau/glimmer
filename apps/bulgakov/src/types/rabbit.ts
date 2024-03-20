import { OutgoingActions, OutgoingWsMessage } from "@glimmer/bulgakov";

export type InternalBulgakovQueueData<T extends OutgoingActions = OutgoingActions> = {
	roomId: string;
	msg: OutgoingWsMessage<T>;
};
