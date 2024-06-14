import { useToggle } from "@glimmer/hooks";
import { ArrowIcon, ViewersCount } from "@glimmer/ui/web";
import { useSpring, animated, config } from "@react-spring/web";
import { Tag } from "apps/dostoevsky/src/modules/Tag";
import { useRoomStore } from "apps/dostoevsky/src/state";
import clsx from "clsx";
import { useRef, useState } from "react";

export const StreamCollapsibleHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { room } = useRoomStore();
	const [expanded, toggleExpanded] = useToggle(true);
	const descRef = useRef<HTMLDivElement>(null);
	const [isFirst, setIsFirst] = useState(true);

	const springs = useSpring({
		from: {
			y: expanded ? -(descRef.current?.clientHeight || 0) : 0,
		},
		to: {
			y: expanded ? 0 : -(descRef.current?.clientHeight || 0),
		},
		onStart: () => isFirst && setIsFirst(false),
		immediate: isFirst,
		config: config.stiff,
	});

	const containerStyles = "max-mobile:px-8 max-mobile:pt-8 px-10 pt-10";

	return (
		<div className="mb-8">
			<div
				className={clsx(
					containerStyles,
					"bg-contrast-100 relative z-50 flex items-center justify-between"
				)}
			>
				<h4> {room?.name}</h4>
				<ArrowIcon
					onClick={toggleExpanded}
					className="cursor-pointer"
					direction={expanded ? "down" : "up"}
				/>
			</div>
			<animated.div style={springs}>
				<div ref={descRef} className="max-mobile:px-8 px-10 pt-4">
					<p className="mb-6">{room?.description}</p>
					<div className="flex justify-between">
						<div className="flex gap-2">
							{room?.tags.map((tag, idx) => <Tag key={idx} tag={tag} />)}
						</div>
						<ViewersCount number={room?.peers.length || 0} />
					</div>
				</div>
				<div className="border-contrast-300 mt-7 border"></div>
				<div className={containerStyles}>{children}</div>
			</animated.div>
		</div>
	);
};
