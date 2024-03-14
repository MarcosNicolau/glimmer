import { Spinner } from "../Loaders";
import clsx from "clsx";

type Props = React.ComponentProps<"button"> & {
	variant?: "accent-fill" | "text" | "text-inverse" | "text-underlined" | "no-fill";
	isLoading?: boolean;
};

export const Button: React.FC<Props> = ({
	className,
	variant = "accent-fill",
	isLoading,
	disabled,
	children,
	...props
}) => (
	<button
		className={clsx(
			"rounded text-sm font-bold transition",
			{
				"bg-accent-100 text-text-contrast-100 enabled:hover:bg-accent-100/90 px-8 py-4":
					variant === "accent-fill",
				"tex-text-100 font-medium underline enabled:hover:no-underline":
					variant === "text-underlined",
				"text-text-100 enabled:hover:text-text-200 bg-transparent": variant === "text",
				"text-text-contrast-100 enabled:hover:text-text-contrast-200 bg-transparent":
					variant === "text-inverse",
				"text-text-100 enabled:hover:text-text-200 bg-transparent px-8 py-4":
					variant === "no-fill",
				"text-text-100/50": (disabled || isLoading) && variant !== "accent-fill",
				"bg-accent-100/50": (disabled || isLoading) && variant === "accent-fill",
			},
			className
		)}
		type="button"
		disabled={disabled || isLoading}
		{...props}
	>
		{isLoading ? <Spinner invertColors={variant === "accent-fill"} /> : children}
	</button>
);
