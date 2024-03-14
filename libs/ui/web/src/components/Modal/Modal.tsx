"use client";

import { useIsMounted, useOnKeyDown, useOnClickOutside } from "@glimmer/hooks";
import { IconBtn } from "libs/ui/web/src/components/Buttons";
import { CrossIcon } from "libs/ui/web/src/components/Icons";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
	open: boolean;
	setOpen: (prev: boolean) => void;
	onOpen?: () => void;
	onClose?: () => void;
	shouldCloseOnEsc?: boolean;
	shouldCloseOnOutsideClick?: boolean;
	showCloseButton?: boolean;
	children?: React.ReactNode;
};

export const Modal: React.FC<Props> = ({
	open,
	setOpen,
	onClose,
	onOpen,
	children,
	showCloseButton = false,
	shouldCloseOnEsc = true,
	shouldCloseOnOutsideClick = true,
}) => {
	const mounted = useIsMounted();
	useOnKeyDown(({ key }) => {
		if (!shouldCloseOnEsc) return;
		if (key === "Escape") setOpen(false);
	});
	const [ref] = useOnClickOutside<HTMLDivElement>(
		() => shouldCloseOnOutsideClick && setOpen(false)
	);

	useEffect(() => {
		if (!mounted) return;
		if (open) onOpen && onOpen();
		if (!open) onClose && onClose();
	}, [mounted, open, onOpen, onClose]);

	if (!open) return null;
	return createPortal(
		<div className="mobile:p-6 bg-modal-overlay absolute inset-0 z-20 h-full w-full p-10">
			<div className="flex h-full w-full items-center justify-center">
				<div ref={ref} className="content relative">
					{showCloseButton && (
						<div className="absolute right-5 top-5 z-30 cursor-pointer">
							<IconBtn icon={CrossIcon} onClick={() => setOpen(false)} />
						</div>
					)}
					{children}
				</div>
			</div>
		</div>,
		document.body
	);
};
