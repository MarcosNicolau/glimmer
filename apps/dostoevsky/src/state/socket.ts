import { MyWebSocket } from "apps/dostoevsky/src/types/ws";
import { create } from "zustand";

type ConnStates = "idle" | "loading" | "error" | "opened";

type SocketStore = {
	socket: MyWebSocket | null;
	setSocket: (socket: MyWebSocket | null) => void;
	connState: ConnStates;
	setConnState: (state: ConnStates) => void;
};

export const useSocketStore = create<SocketStore>((set) => ({
	socket: null,
	connState: "idle",
	setSocket: (socket) => set(() => ({ socket })),
	setConnState: (connState) => set(() => ({ connState })),
}));
