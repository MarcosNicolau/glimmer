import { Send } from "../types/operations";

export const sendRoomNotExist = (roomId: string, peerId: string, send: Send) => {
	send({ op: "@room:doesn't-exist", d: { roomId, peerId } });
};
