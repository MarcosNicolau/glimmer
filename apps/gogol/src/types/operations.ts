import { BulgakovMsgData, BulgakovOperations, GogolMessage, GogolOperations } from "@glimmer/types";

export type Send = <T extends GogolOperations>({}: GogolMessage<T>) => void;

export type OperationsHandlers = {
	[key in BulgakovOperations]: (d: BulgakovMsgData[key], send: Send, errBack: () => void) => void;
};
