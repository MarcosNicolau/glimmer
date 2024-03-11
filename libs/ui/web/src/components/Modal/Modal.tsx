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
		<div className="p-10 mobile:p-6 h-full w-full bg-black/20 inset-0 absolute z-20">
			<div className="flex items-center justify-center h-full w-full">
				<div ref={ref} className="content relative">
					{showCloseButton && (
						<div className="absolute right-5 top-5 cursor-pointer z-30">
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
