import { SvgProps } from "apps/dostoevsky/src/ui/icons/Svg";
import clsx from "clsx";

type Props = React.ComponentProps<"input"> & {
	icon?: React.FC<SvgProps>;
	variant?: "primary" | "secondary";
};

export const Input: React.FC<Props> = ({
	className,
	icon: Icon,
	variant = "primary",
	...props
}) => (
	<div className="relative">
		{Icon && (
			<div className="absolute inset-y-0 left-0 flex items-center pl-3">
				<Icon width={20} className="fill-text-200" />
			</div>
		)}
		<input
			type="text"
			className={clsx(
				"placeholder:text-text-200 text-text-100 border-contrast-300 w-full rounded-s border p-4 text-sm",
				{
					"pl-10": !!Icon,
					"bg-contrast-200": variant === "primary",
					"bg-contrast-300": variant === "secondary",
				},
				className
			)}
			{...props}
		/>
	</div>
);
