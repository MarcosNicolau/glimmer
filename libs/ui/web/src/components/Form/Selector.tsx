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
	optionsParentClassName?: string;
};

export const Select: React.FC<Props> = ({
	options,
	onChange,
	showArrow,
	variant = "filled",
	matchOptionsWidth,
	selectedRender,
	horizontal,
	optionsParentClassName,
}) => {
	const [selectedOption, setSelectedOption] = useState(
		options.find((option) => option.isSelected) || options[0]
	);
	const [showOptions, toggle, setShowOptions] = useToggle();
	const [parentRef] = useOnClickOutside<HTMLDivElement>(() => setShowOptions(false));
	const [selectedRef, { height: selectedHeight }] = useComponentDimensions<HTMLDivElement>();
	const [optionsRef, { width: optsWidth }] = useComponentDimensions<HTMLDivElement>();
	useOnKeyDown(({ key }) => key === "Escape" && setShowOptions(false));

	useEffect(() => {
		onChange(selectedOption?.value);
		toggle();
	}, [selectedOption]);

	return (
		<div ref={parentRef} className="flex flex-col relative justify-center items-center">
			{/* wait till the width has been set to prevent a weird flash */}
			{(matchOptionsWidth ? optsWidth : true) && (
				<div
					ref={selectedRef}
					className={clsx("cursor-pointer flex justify-center gap-4 items-center", {
						"bg-contrast-300 rounded-s p-2": variant === "filled",
						"justify-between": showArrow,
					})}
					// @ts-expect-error complains about optsWidth being null, but we are checking it above
					style={{ width: matchOptionsWidth ? optsWidth : "auto" }}
					onClick={toggle}
				>
					{selectedRender ? (
						selectedRender(selectedOption)
					) : (
						<div className="flex items-center justify-center gap-2">
							{selectedOption?.icon && <selectedOption.icon />}
							{(selectedOption?.textWhenSelected || selectedOption?.text) && (
								<p className="text-md text-text-100">
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
					"transition bg-contrast-100 opacity-100 visible z-10 mt-2 max-tablet:mt-4 border-contrast-300 absolute max-h-[150px] flex flex-wrap overflow-auto rounded border",
					{
						"opacity-[0] invisible": !showOptions,
						"flex-col": !horizontal,
					},
					optionsParentClassName
				)}
				style={{ top: selectedHeight || 0 }}
				ref={optionsRef}
			>
				{options.map((option, idx) => (
					<Option key={idx} onClick={() => setSelectedOption(option)} {...option} />
				))}
			</div>
		</div>
	);
};
