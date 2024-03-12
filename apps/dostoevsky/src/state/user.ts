import { User } from "apps/dostoevsky/src/types/user";
import { create } from "zustand";

type State = Omit<User, "id"> & {
	isLoaded: boolean;
};

type Actions = {
	setUser: (user: Partial<Omit<User, "id">>) => void;
	setIsLoaded: (isLoaded: boolean) => void;
};

export const useUserStore = create<State & Actions>()((set) => ({
	name: "",
	description: "",
	image: "",
	links: [],
	isLoaded: false,
	roomId: null,
	setIsLoaded: (isLoaded) => set(() => ({ isLoaded })),
	setUser: (user) => set((_user) => ({ ..._user, ...user })),
}));
