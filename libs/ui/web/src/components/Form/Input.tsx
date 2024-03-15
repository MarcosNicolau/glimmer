"use client";
import { SvgProps } from "../Icons/Svg";
import clsx from "clsx";
import { LegacyRef, forwardRef, useEffect, useRef, useState } from "react";

type Props = React.ComponentProps<"input"> & {
	icon?: React.FC<SvgProps>;
	variant?: "primary" | "secondary" | "tertiary";
	error?: string | boolean;
	isError?: boolean;
	textArea?: Omit<React.ComponentProps<"textarea">, keyof React.ComponentProps<"input">>;
	prefix?: string;
	RightButton?: React.ReactNode;
	// You'll need to provide the value for this to work
	adjustWidthToText?: boolean;
	showMaxLengthCounter?: boolean;
};

// We are using react hooks form, which passes a ref to the input component when registering it
export const Input = forwardRef(
	(
		{
			className,
			style,
			icon: Icon,
			variant = "primary",
			error,
			textArea,
			RightButton,
			prefix,
			adjustWidthToText,
			isError,
			showMaxLengthCounter,
			...props
		}: Props,
		ref: LegacyRef<HTMLInputElement | HTMLTextAreaElement> | undefined
	) => {
		const styles = clsx(
			"placeholder:text-text-200 text-text-100 border-contrast-300 rounded-s border p-4 text-sm",
			{
				"!w-full": !adjustWidthToText,
				"pl-10": !!Icon,
				"pl-7": prefix,
				"bg-contrast-100": variant === "primary",
				"bg-contrast-200": variant === "secondary",
				"bg-contrast-300 border-none": variant === "tertiary",
				"border-red": error || isError,
				"pr-8": !!RightButton,
			},
			className
		);
		const p = useRef(
			(() => {
				if (!adjustWidthToText) return;
				const p = document.createElement("p");
				p.className = `invisible absolute ${styles}`;
				document.body.appendChild(p);
				return p;
			})()
		);
		const [textWidth, setTextWidth] = useState(0);

		useEffect(() => {
			if (!adjustWidthToText || !p.current) return;
			p.current.textContent = props.value?.toString() || "";
			setTextWidth(p.current.clientWidth);
		}, [props.value]);

		return (
			<div>
				<div className="group relative">
					{Icon && (
						<div className="absolute left-0 top-0 flex pl-3 pt-4">
							<Icon width={20} className="fill-text-200" />
						</div>
					)}
					{prefix && (
						<div className="absolute left-0 top-0 flex pl-3 pt-4">
							<p className="text-text-100 small ">{prefix}</p>
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
							style={{
								width: adjustWidthToText ? `${textWidth + 14}px ` : "",
								...style,
							}}
							//@ts-expect-error cant make the ref type works for both at the same time
							ref={ref}
							{...props}
						/>
					)}
					{RightButton && (
						<div className="absolute right-0 top-0 flex pr-3 pt-4">{RightButton}</div>
					)}
				</div>
				{showMaxLengthCounter && (
					<p className="mt-1 text-right text-xs">
						{props.value?.toString().length || 0}/{props.maxLength}
					</p>
				)}
				{error?.toString() && <p className="small text-red mt-1">{error}</p>}
			</div>
		);
	}
);
