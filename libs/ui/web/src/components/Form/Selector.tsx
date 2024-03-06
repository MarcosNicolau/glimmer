import { useOnKeyDown, useOnClickOutside, useToggle } from "@glimmer/hooks";
import { Option, Props as OptionProps } from "../Form";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { FilledArrowIcon } from "libs/ui/web/src/components/Icons/FilledArrow";

type Props = {
	options: Omit<OptionProps, "onClick">[];
	onChange: (value: string) => void;
	variant?: "filled" | "no-fill";
	showArrow?: boolean;
	children?: React.ReactNode;
};

export const Select: React.FC<Props> = ({
	options,
	onChange,
	showArrow,
	variant = "filled",
	children,
}) => {
	const [selectedOption, setSelectedOption] = useState(
		options.find((option) => option.isSelected) || options[0]
	);
	const [showOptions, toggle, setShowOptions] = useToggle();
	const [ref] = useOnClickOutside<HTMLDivElement>(() => setShowOptions(false));
	useOnKeyDown(({ key }) => key === "Escape" && setShowOptions(false));

	useEffect(() => {
		onChange(selectedOption.value);
		toggle();
	}, [selectedOption]);

	return (
		<>
			<div ref={ref} className="relative flex flex-col items-center">
				<div
					className={clsx("p-2 flex relative flex-col justify-center items-center gap-4")}
				>
					<div
						className={clsx(
							"cursor-pointer flex w-full justify-center gap-4 items-center p-2",
							{
								"bg-contrast-300 rounded-s": variant === "filled",
								"justify-between": showArrow,
							}
						)}
						onClick={toggle}
					>
						{children ? (
							children
						) : (
							<div className="flex items-center justify-center gap-2">
								{selectedOption?.icon && <selectedOption.icon />}
								{selectedOption.displayText && (
									<p className="text-md  text-text-100">
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
					<div
						className={clsx(
							"transition opacity-100 border-contrast-300 w-full left-0 top-0 flex max-h-[150px] flex-col overflow-auto rounded border",
							{ "opacity-[0]": !showOptions }
						)}
					>
						{options.map((option, idx) => (
							<Option
								key={idx}
								onClick={() => setSelectedOption(option)}
								{...option}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
};
