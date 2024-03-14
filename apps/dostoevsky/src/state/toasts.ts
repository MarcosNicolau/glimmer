import { generateRandomString } from "@glimmer/utils";
import { create } from "zustand";

export type Toast = {
	id: string;
	title: string;
	timerInMs: number;
	buttonText?: string;
	onClick?: () => void;
	onTimerEnd?: () => void;
};

type Store = {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, "id">) => void;
	removeToast: (id: string) => void;
};

export const useToastsStore = create<Store>((set) => ({
	toasts: [],
	addToast: (toast) =>
		set(({ toasts }) => ({ toasts: [...toasts, { ...toast, id: generateRandomString(5) }] })),
	removeToast: (id: string) =>
		set(({ toasts }) => ({ toasts: toasts.filter((toast) => toast.id !== id) })),
}));
