"use client";

import { useToggle } from "@glimmer/hooks";
import { Button } from "@glimmer/ui/web";
import { useSpring, animated } from "@react-spring/web";
import { Toast as Props, useToastsStore } from "apps/dostoevsky/src/state";
import clsx from "clsx";
import { useEffect, useState } from "react";

export const Toast: React.FC<Props> = ({
	id,
	title,
	type,
	timerInMs,
	onTimerEnd,
	buttonText,
	onClick,
}) => {
	const { removeToast } = useToastsStore();
	const [progress, setProgress] = useState(0);
	const [paused, togglePaused] = useToggle(false);
	const [hide, setHide] = useState(false);

	const springs = useSpring({
		from: { opacity: !hide ? 0 : 1, y: !hide ? 10 : 0 },
		to: { opacity: !hide ? 1 : 0, y: !hide ? 0 : 10 },
		config: {
			duration: 200,
		},
		onRest: () => hide && removeToast(id),
	});

	useEffect(() => {
		if (paused) return;
		if (progress >= 1) {
			setHide(true);
			onTimerEnd && onTimerEnd();
			return;
		}
		setTimeout(() => {
			// If the timeout runs every 16ms(60fps), then to reach 1 in the specified timer, we need to
			// divide 16 by the timer so that the progress advances accordingly to reach 1 in the specified time.
			// For example, suppose the timerInMs is 1000(ms)
			// Then 16/1000=0.016,
			// The amount of times it needs to run to reach 1 is given by, 0.016*x=1 -> x = 62.5
			// The timeout runs every 16ms, so the total time that it passes is: 16*62.5=1000
			setProgress((prev) => prev + 16 / timerInMs);
		}, 16);
	}, [progress, paused, onTimerEnd, timerInMs]);

	return (
		<animated.div
			id="toast"
			onMouseEnter={togglePaused}
			onMouseLeave={togglePaused}
			onClick={() => setHide(true)}
			className={clsx(
				"relative flex min-w-[300px] cursor-pointer items-center gap-10 rounded px-8 py-4",
				{
					"bg-accent-100": type === "normal",
					"bg-red": type === "error",
				}
			)}
			style={{ ...springs }}
		>
			<p
				className={clsx("small text-center", {
					"text-text-contrast-100": type === "normal",
					"text-white": type === "error",
				})}
			>
				{title}
			</p>

			{buttonText && (
				<div className="flex items-center justify-center gap-4">
					<Button
						variant="text"
						className={clsx("font-bold", {
							"!text-contrast-300 hover:!text-contrast-200": type === "normal",
							"!text-white hover:!text-white/85": type === "error",
						})}
						onClick={onClick}
					>
						{buttonText}
					</Button>
				</div>
			)}
			{/* Progress bar */}
			<div
				className={clsx("absolute bottom-0 left-0 h-1 transition", {
					"bg-contrast-300": type === "normal",
					"bg-white": type === "error",
				})}
				style={{ width: `${progress * 100}%` }}
			></div>
		</animated.div>
	);
};
