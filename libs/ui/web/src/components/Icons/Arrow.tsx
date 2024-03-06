import { AppSvg, SvgProps } from "./Svg";
import clsx from "clsx";

type Props = SvgProps & {
	direction: "up" | "down" | "right" | "left";
};

export const Arrow: React.FC<Props> = ({ direction, ...props }) => (
	<AppSvg
		className={clsx("transition", {
			"rotate-180": direction === "up",
			"rotate-90": direction === "right",
			"-rotate-90": direction === "left",
			"rotate-0": direction === "down",
		})}
		{...props}
	>
		<path
			fillRule="evenodd"
			d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
			clipRule="evenodd"
		/>
	</AppSvg>
);
