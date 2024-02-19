import {
    BulgakovMsgData,
    BulgakovOperations,
    GogolOperations,
    GogolQueueMessage,
} from "@glimmer/types";

export type Send = <T extends GogolOperations>({}: GogolQueueMessage<T>) => void;

export type OperationsHandlers = {
    [key in BulgakovOperations]: (d: BulgakovMsgData[key], send: Send, errBack: () => void) => void;
};
