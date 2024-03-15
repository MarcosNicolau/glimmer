import { User } from "apps/dostoevsky/src/types/user";

export type EditMyProfileForm = Omit<User, "id">;

export type OnSubmitProp = {
	onSubmit: (d: EditMyProfileForm) => void;
};
