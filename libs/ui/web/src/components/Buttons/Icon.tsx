import { SvgProps } from "../Icons/Svg";
import clsx from "clsx";

type Props = React.ComponentProps<"button"> & {
	icon: React.FC<SvgProps & { [key: string]: any }>;
	variant?: "filled" | "plain" | "plain-inverse";
};

export const IconBtn: React.FC<Props> = ({
	icon: Icon,
	variant = "plain",
	className,
	...props
}) => (
	<button
		type="button"
		className={clsx(
			"cursor-pointer transition",
			{
				"bg-accent-100 hover:bg-accent-200 fill-contrast-100 rounded p-1":
					variant === "filled",
				"fill-accent-200 hover:fill-accent-100": variant === "plain",
				"fill-contrast-100 hover:fill-contrast-200": variant === "plain-inverse",
			},
			className
		)}
		{...props}
	>
		<Icon className={clsx("cursor-pointer fill-inherit transition")} />
	</button>
);
