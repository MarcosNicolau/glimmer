import { User } from "apps/dostoevsky/src/types/user";
import { create } from "zustand";

type Actions = {
	setUser: (user: Partial<Omit<User, "id">>) => void;
};

export const useUserStore = create<User & Actions>()((set) => ({
	id: "",
	name: "",
	description: "",
	image: "",
	links: [],
	setUser: (user) => set((_user) => ({ ..._user, ...user })),
}));
