import { SvgProps } from "../Icons/Svg";
import clsx from "clsx";
import { LegacyRef, forwardRef } from "react";

type Props = React.ComponentProps<"input"> & {
	icon?: React.FC<SvgProps>;
	variant?: "primary" | "secondary";
	error?: string | boolean;
	textArea?: Omit<React.ComponentProps<"textarea">, keyof React.ComponentProps<"input">>;
	RightButton?: React.ReactNode;
};

// We are using react hooks form, which passes a ref to the input component when registering it
export const Input = forwardRef(
	(
		{
			className,
			icon: Icon,
			variant = "primary",
			error,
			textArea,
			RightButton,
			...props
		}: Props,
		ref: LegacyRef<HTMLInputElement | HTMLTextAreaElement> | undefined
	) => {
		const styles = clsx(
			"placeholder:text-text-200 text-text-100 border-contrast-300 w-full rounded-s border p-4 text-sm",
			{
				"pl-10": !!Icon,
				"bg-contrast-100": variant === "primary",
				"bg-contrast-300": variant === "secondary",
				"border-red": error,
				"pr-8": !!RightButton,
			},
			className
		);
		return (
			<div className="w-full">
				<div className="relative">
					{Icon && (
						<div className="absolute left-0 top-0 flex pl-3 pt-4">
							<Icon width={20} className="fill-text-200" />
						</div>
					)}
					{textArea ? (
						<textarea
							className={clsx(styles, className)}
							//@ts-expect-error cant make the ref type works for both at the same time
							ref={ref}
							{...textArea}
							{...props}
						></textarea>
					) : (
						<input
							type="text"
							className={clsx(styles, className)}
							//@ts-expect-error cant make the ref type works for both at the same time
							ref={ref}
							{...props}
						/>
					)}
					{RightButton && (
						<div className="absolute right-0 top-0 flex pr-3 pt-4">{RightButton}</div>
					)}
				</div>
				{error?.toString() && <p className="small text-red mt-1">{error}</p>}
			</div>
		);
	}
);
