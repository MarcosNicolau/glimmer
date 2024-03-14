"use client";
import { Toast } from "./Toast";
import { useToastsStore } from "apps/dostoevsky/src/state";

export const ToastContainer = () => {
	const { toasts } = useToastsStore();

	return (
		<div className="absolute bottom-[15%] z-50 flex w-full flex-col items-center gap-5">
			{toasts.map((toast) => (
				<Toast key={toast.id} {...toast} />
			))}
		</div>
	);
};
