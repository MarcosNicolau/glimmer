import { useIsMounted } from "apps/dostoevsky/src/hooks/useIsMounted";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
	open: boolean;
	setOpen: (prev: boolean) => void;
	onOpen?: () => void;
	onClose?: () => void;
	shouldCloseOnEsc?: boolean;
	shouldCloseOnOutsideClick?: boolean;
	children?: React.ReactNode;
};

export const Modal: React.FC<Props> = ({
	open,
	setOpen,
	onClose,
	onOpen,
	children,
	shouldCloseOnEsc = true,
	shouldCloseOnOutsideClick = true,
}) => {
	const mounted = useIsMounted();

	useEffect(() => {
		if (!mounted) return;
		if (open) onOpen && onOpen();
		if (!open) onClose && onClose();
	}, [mounted, open, onOpen, onClose]);

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (e.target?.id === "outside") setOpen(false);
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		shouldCloseOnOutsideClick && window.addEventListener("click", onClick);
		shouldCloseOnEsc && window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("click", onClick);
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [shouldCloseOnOutsideClick]);

	if (!open) return null;
	return createPortal(
		<div id="outside" className="p-10 mobile:p-6 h-full w-full bg-black/20 inset-0 absolute">
			<div id="outside" className="flex items-center justify-center h-full">
				<div id="content">{children}</div>
			</div>
		</div>,
		document.body
	);
};
