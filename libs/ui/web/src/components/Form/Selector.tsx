"use client";

import { useOnKeyDown, useOnClickOutside, useToggle, useComponentDimensions } from "@glimmer/hooks";
import { Option, Props as OptionProps } from "../Form";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { FilledArrowIcon } from "../Icons/FilledArrow";

type Option = Omit<OptionProps, "onClick"> & {
	/**
	 * If not provided, defaults to text value
	 */
	textWhenSelected?: string;
};

type Props = {
	options: Option[];
	onChange: (value: string) => void;
	variant?: "filled" | "no-fill";
	matchOptionsWidth?: boolean;
	showArrow?: boolean;
	children?: React.ReactNode;
	selectedRender?: (selectedOption: Option) => React.ReactNode;
	horizontal?: boolean;
	classNames?: {
		options?: string;
		container?: string;
		select?: string;
	};
};

export const Select: React.FC<Props> = ({
	options,
	onChange,
	showArrow,
	variant = "filled",
	matchOptionsWidth,
	selectedRender,
	horizontal,
	classNames,
}) => {
	const [selectedOption, setSelectedOption] = useState(
		options.find((option) => option.isSelected) || options[0]
	);
	const [showOptions, toggle, setShowOptions] = useToggle();
	const [parentRef] = useOnClickOutside<HTMLDivElement>(() => setShowOptions(false));
	const [selectedRef, { height: selectedHeight, width: selectedWidth }] =
		useComponentDimensions<HTMLDivElement>();
	const [optionsRef, { width: optsWidth }] = useComponentDimensions<HTMLDivElement>();
	useOnKeyDown(({ key }) => key === "Escape" && setShowOptions(false));

	useEffect(() => {
		onChange(selectedOption?.value);
		toggle();
	}, [selectedOption]);

	return (
		<div
			ref={parentRef}
			className={clsx(
				"relative flex flex-col items-center justify-center",
				classNames?.container
			)}
		>
			{/* wait till the width has been set to prevent a weird flash */}
			{(matchOptionsWidth ? optsWidth : true) && (
				<div
					ref={selectedRef}
					className={clsx(
						"flex cursor-pointer items-center justify-center gap-4",
						{
							"bg-contrast-300 rounded-s px-4 py-2": variant === "filled",
							"justify-between": showArrow,
						},
						classNames?.select
					)}
					style={{
						width:
							matchOptionsWidth && selectedWidth && optsWidth > selectedWidth
								? optsWidth
								: "auto",
					}}
					onClick={toggle}
				>
					{selectedRender ? (
						selectedRender(selectedOption)
					) : (
						<div className="flex items-center justify-center gap-2">
							{selectedOption?.icon && <selectedOption.icon />}
							{(selectedOption?.textWhenSelected || selectedOption?.text) && (
								<p className="small text-text-100">
									{selectedOption?.textWhenSelected || selectedOption?.text}
								</p>
							)}
						</div>
					)}
					{showArrow && (
						<FilledArrowIcon
							className={clsx("duration-300", {
								"rotate-180": showOptions,
							})}
						/>
					)}
				</div>
			)}
			<div
				className={clsx(
					"bg-contrast-100 max-tablet:mt-4 border-contrast-300 visible absolute z-10 mt-2 flex max-h-[150px] flex-wrap overflow-auto rounded border opacity-100 transition",
					{
						"invisible opacity-[0]": !showOptions,
						"flex-col": !horizontal,
					},
					classNames?.options
				)}
				style={{
					top: selectedHeight,
					width: matchOptionsWidth && optsWidth < selectedWidth ? selectedWidth : "auto",
				}}
				ref={optionsRef}
			>
				{options.map((option, idx) => (
					<Option key={idx} onClick={() => setSelectedOption(option)} {...option} />
				))}
			</div>
		</div>
	);
};
