"use client";
import { Toast } from "./Toast";
import { useToastsStore } from "apps/dostoevsky/src/state";

type Props = {
	id: number;
};

export const ToastContainer: React.FC<Props> = ({ id }) => {
	const { toasts, activeToastId } = useToastsStore();

	if (activeToastId !== id) return null;
	return (
		<div className="absolute bottom-[15%] left-0 z-50 flex w-full flex-col items-center gap-5">
			<div className="max-w-[90%]">
				{toasts.map((toast) => (
					<Toast key={toast.id} {...toast} />
				))}
			</div>
		</div>
	);
};
