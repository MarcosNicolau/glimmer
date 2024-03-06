import { SvgProps } from "../Icons/Svg";
import clsx from "clsx";
import { LegacyRef, forwardRef } from "react";

type Props = React.ComponentProps<"input"> & {
	icon?: React.FC<SvgProps>;
	variant?: "primary" | "secondary";
	error?: string | boolean;
};

// We are using react hooks form, which passes a ref to the input component when registering it
export const Input = forwardRef(
	(
		{ className, icon: Icon, variant = "primary", error, ...props }: Props,
		ref: LegacyRef<HTMLInputElement> | undefined
	) => {
		return (
			<div className="w-full">
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
								"bg-contrast-100": variant === "primary",
								"bg-contrast-300": variant === "secondary",
								"border-red": error,
							},
							className
						)}
						ref={ref}
						{...props}
					/>
				</div>
				{error?.toString() && <p className="small text-red mt-1">{error}</p>}
			</div>
		);
	}
);
