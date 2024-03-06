import { useOnKeyDown, useOnClickOutside, useToggle } from "@glimmer/hooks";
import { Option, Props as OptionProps } from "../Form";
import { useEffect, useState } from "react";

type Props = {
	options: Omit<OptionProps, "onClick">[];
	onChange: (value: string) => void;
	showArrow?: boolean;
	children?: React.ReactNode;
};

export const Select: React.FC<Props> = ({ options, onChange, children }) => {
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
				<div onClick={toggle} className="flex cursor-pointer items-center gap-4">
					{children ? (
						children
					) : (
						<>
							{selectedOption?.icon && <selectedOption.icon />}
							{selectedOption.displayText && (
								<p className="text-lg">{selectedOption.displayText}</p>
							)}
						</>
					)}
				</div>
				{showOptions && (
					<div className="border-contrast-300 absolute top-0 mt-8 flex max-h-[150px] flex-col overflow-auto rounded border">
						{options.map((option, idx) => (
							<Option
								key={idx}
								onClick={() => setSelectedOption(option)}
								{...option}
							/>
						))}
					</div>
				)}
			</div>
		</>
	);
};
