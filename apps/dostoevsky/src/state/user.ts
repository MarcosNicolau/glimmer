import { LOCAL_STORAGE_KEYS } from "apps/dostoevsky/src/libs/constants";
import { useSocketStore } from "apps/dostoevsky/src/state/socket";
import { User } from "apps/dostoevsky/src/types/user";
import { create } from "zustand";

type State = User & {
	isLoaded: boolean;
};

type Actions = {
	setUser: (user: Partial<User>) => void;
	setIsLoaded: (isLoaded: boolean) => void;
};

export const useUserStore = create<State & Actions>()((set) => ({
	id: "",
	name: "",
	description: "",
	image: "",
	links: [],
	isLoaded: false,
	roomId: null,
	setIsLoaded: (isLoaded) => set(() => ({ isLoaded })),
	setUser: (user) =>
		set((_user) => {
			const updated = { ..._user, ...user };
			localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updated));
			const { socket, connState } = useSocketStore.getState();
			//If the connState is closed, the profile will be stored sent on the next page reload
			if (connState === "opened")
				socket?.sendJson({
					action: "@user:send-profile",
					payload: {
						user: updated,
					},
				});
			return updated;
		}),
}));
