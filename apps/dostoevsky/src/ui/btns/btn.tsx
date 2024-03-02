import clsx from "clsx";

type Props = React.ComponentProps<"button"> & {
	variant?: "accent-fill" | "text" | "no-fill";
};

export const Button: React.FC<Props> = ({
	className,
	variant = "accent-fill",
	children,
	...props
}) => (
	<button
		className={clsx(
			"rounded  text-sm font-bold transition",
			{
				"bg-accent-100 text-text-contrast-100 hover:bg-accent-100/90 px-8 py-4":
					variant === "accent-fill",
				"text-text-100 hover:text-text-200 bg-transparent": variant === "text",
				"text-text-100 hover:text-text-200 bg-transparent  px-8 py-4":
					variant === "no-fill",
			},
			className
		)}
		{...props}
	>
		{children}
	</button>
);
