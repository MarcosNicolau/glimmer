"use client";
import { animated, useSpring } from "@react-spring/web";
import { useState } from "react";
import { createPortal } from "react-dom";

type Props = {
	open: boolean;
	children?: React.ReactNode;
};
export const Drawer: React.FC<Props> = ({ open, children }) => {
	const [hide, setHide] = useState(true);

	const enter = useSpring({
		from: { opacity: open ? 0 : 1 },
		to: { opacity: open ? 1 : 0 },
		onStart: () => open && setHide(false),
		onRest: () => !open && setHide(true),
		delay: !open ? 100 : 0,
		config: {
			duration: 100,
		},
	});

	const side = useSpring({
		from: { x: open ? -300 : 0 },
		to: { x: open ? 0 : -300 },
		delay: !open ? 0 : 50,
		config: {
			duration: 200,
		},
	});

	if (hide) return null;
	return createPortal(
		<animated.div
			className="mobile:p-6 h-full w-full bg-black/20 inset-0 absolute"
			style={enter}
			suppressHydrationWarning
		>
			<animated.div style={side} className="h-full w-[300px] bg-contrast-100">
				{children}
			</animated.div>
		</animated.div>,
		document.body
	);
};
