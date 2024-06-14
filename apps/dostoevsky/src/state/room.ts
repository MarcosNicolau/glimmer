import { OutgoingActionsPayload } from "@glimmer/bulgakov";
import { create } from "zustand";
import { types } from "mediasoup-client";

type MyState = Pick<
	OutgoingActionsPayload["@room:state"]["room"]["peers"][0],
	"askedToSpeak" | "isDeafened" | "isMuted" | "isSpeaker" | "role"
>;

type State = {
	id: string | null;
	room: OutgoingActionsPayload["@room:state"]["room"] | undefined;
	myState: MyState | undefined;
	// maps peerId/userId with its track (if its a speaker ofc)
	streams: Record<string, MediaStream>;
	isLoaded: boolean;
	transports: {
		send: types.Transport | null;
		recv: types.Transport | null;
	};
	setRoomId: (id: string | null) => void;
	setRoom: (room: Partial<OutgoingActionsPayload["@room:state"]["room"]> | null) => void;
	setPeers: (peers: OutgoingActionsPayload["@room:state"]["room"]["peers"]) => void;
	setPeer: (
		peerId: string,
		state: Partial<OutgoingActionsPayload["@room:state"]["room"]["peers"][0]>
	) => void;
	setMyState: (myState: Partial<MyState> | null) => void;
	setIsLoaded: (loaded: boolean) => void;
	setStreams: (streams: Record<string, MediaStream>) => void;
	setTransports: (transports: {
		send?: types.Transport | null;
		recv?: types.Transport | null;
	}) => void;
};

export const useRoomStore = create<State>((set) => ({
	id: null,
	room: undefined,
	myState: undefined,
	isLoaded: false,
	transports: {
		recv: null,
		send: null,
	},
	streams: {},
	setRoomId: (id) => set(() => ({ id })),
	setRoom: (room) =>
		//@ts-expect-error complains coz room can be partial but that is ok
		set(({ room: _room = {} }) => ({
			room: room ? { ..._room, ...room } : undefined,
		})),
	setMyState: (myState) =>
		//@ts-expect-error same as above
		set(({ myState: _myState = {} }) => ({
			myState: myState ? { ..._myState, ...myState } : undefined,
		})),
	setPeers: (peers) => set(({ room }) => ({ room: room && { ...room, peers } })),
	setPeer: (peerId, state) =>
		set(({ room }) =>
			room
				? {
						room: {
							...room,
							peers: room.peers.map((peer) =>
								peer.user.id === peerId ? { ...peer, ...state } : peer
							),
						},
					}
				: {}
		),
	setIsLoaded: (isLoaded) => set(() => ({ isLoaded })),
	setTransports: ({ send, recv }) =>
		set(({ transports }) => ({
			transports: {
				recv: recv !== undefined ? recv : transports.recv,
				send: send !== undefined ? send : transports.send,
			},
		})),
	setStreams: (streams) =>
		set(({ streams: _streams }) => ({ streams: { ..._streams, ...streams } })),
}));
