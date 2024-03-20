import { WithOptional } from "@glimmer/types";
import { generateRandomString } from "@glimmer/utils";
import { create } from "zustand";

export type Toast = {
	id: string;
	title: string;
	buttonText?: string;
	// defaults to 3000ms
	timerInMs: number;
	// defaults to normal
	type: "normal" | "error";
	onClick?: () => void;
	onTimerEnd?: () => void;
};

type Store = {
	toasts: Toast[];
	activeToastId: number;
	addToast: (toast: WithOptional<Omit<Toast, "id">, "type" | "timerInMs">) => void;
	removeToast: (id: string) => void;
	// if passed null, id defaults to 0
	setActiveToastId: (id: number | null) => void;
};

export const useToastsStore = create<Store>((set) => ({
	toasts: [],
	activeToastId: 0,
	setActiveToastId: (id) => set({ activeToastId: id ? id : 0 }),
	addToast: (toast) =>
		set(({ toasts }) => ({
			toasts: [
				...toasts,
				{
					...toast,
					type: toast.type || "normal",
					timerInMs: toast.timerInMs || 3000,
					id: generateRandomString(5),
				},
			],
		})),
	removeToast: (id: string) =>
		set(({ toasts }) => ({ toasts: toasts.filter((toast) => toast.id !== id) })),
}));
