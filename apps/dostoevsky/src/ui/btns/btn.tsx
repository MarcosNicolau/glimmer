import clsx from "clsx";

type Props = React.ComponentProps<"button"> & {
	variant?: "accent-fill" | "text";
};

export const Button: React.FC<Props> = ({
	className,
	variant = "accent-fill",
	children,
	...props
}) => (
	<button
		className={clsx(
			"rounded px-8 py-4 text-sm font-bold transition",
			{
				"bg-accent-100 text-text-contrast-100 hover:bg-accent-100/90":
					variant === "accent-fill",
				"text-text-100 hover:text-text-200 bg-transparent": variant === "text",
			},
			className
		)}
		{...props}
	>
		{children}
	</button>
);
