import { User } from "apps/dostoevsky/src/types/user";
import { GenerateBasicStoreActions } from "apps/dostoevsky/src/types/utils";
import { create } from "zustand";

type Actions = GenerateBasicStoreActions<keyof Omit<User, "id">> & {
	setUser: (user: User) => void;
};

export const useUserStore = create<User & Actions>()((set) => ({
	id: "",
	name: "",
	description: "",
	image: "",
	links: [],
	setDescription: (description: string) => set(() => ({ description })),
	setName: (name: string) => set(() => ({ name })),
	setImage: (image: string) => set(() => ({ image })),
	setLinks: (links: User["links"]) => set(() => ({ links })),
	setUser: (user: User) => set(() => ({ ...user })),
}));
