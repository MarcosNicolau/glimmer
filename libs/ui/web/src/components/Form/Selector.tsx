import { useOnKeyDown, useOnClickOutside, useToggle } from "@glimmer/hooks";
import { Option, Props as OptionProps } from "../Form";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { FilledArrowIcon } from "../Icons/FilledArrow";

type Props = {
	options: Omit<OptionProps, "onClick">[];
	onChange: (value: string) => void;
	variant?: "filled" | "no-fill";
	matchOptionsWidth?: boolean;
	showArrow?: boolean;
	children?: React.ReactNode;
};

export const Select: React.FC<Props> = ({
	options,
	onChange,
	showArrow,
	variant = "filled",
	matchOptionsWidth,
	children,
}) => {
	const [selectedOption, setSelectedOption] = useState(
		options.find((option) => option.isSelected) || options[0]
	);
	const [width, setWidth] = useState(0);
	const optionsRef = useRef<HTMLDivElement>(null);
	const [showOptions, toggle, setShowOptions] = useToggle();
	const [ref] = useOnClickOutside<HTMLDivElement>(() => setShowOptions(false));
	useOnKeyDown(({ key }) => key === "Escape" && setShowOptions(false));

	useEffect(() => {
		onChange(selectedOption.value);
		toggle();
	}, [selectedOption]);

	useEffect(() => {
		if (optionsRef.current) setWidth(optionsRef.current?.clientWidth);
	}, [optionsRef.current]);

	return (
		<div ref={ref} className="relative flex flex-col items-center">
			{/* wait till the width has been set to prevent a weird flash */}
			{(matchOptionsWidth ? width : true) && (
				<div
					className={clsx("cursor-pointer flex justify-center gap-4 items-center p-2", {
						"bg-contrast-300 rounded-s": variant === "filled",
						"justify-between": showArrow,
					})}
					style={{ width: matchOptionsWidth ? width : "auto" }}
					onClick={toggle}
				>
					{children ? (
						children
					) : (
						<div className="flex items-center justify-center gap-2">
							{selectedOption?.icon && <selectedOption.icon />}
							{selectedOption.displayText && (
								<p className="text-md text-text-100">
									{selectedOption.displayText}
								</p>
							)}
						</div>
					)}
					{showArrow && (
						<FilledArrowIcon
							className={clsx("duration-300", {
								" rotate-180": showOptions,
							})}
						/>
					)}
				</div>
			)}

			<div
				className={clsx(
					"transition opacity-100 visible border-contrast-300 absolute mt-[50px] flex max-h-[150px] flex-col overflow-auto rounded border",
					{ "opacity-[0] invisible": !showOptions }
				)}
				ref={optionsRef}
			>
				{options.map((option, idx) => (
					<Option key={idx} onClick={() => setSelectedOption(option)} {...option} />
				))}
			</div>
		</div>
	);
};
