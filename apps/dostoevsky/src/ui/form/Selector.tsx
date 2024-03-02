import { useToggle } from "apps/dostoevsky/src/hooks/useToggle";
import { Option, Props as OptionProps } from "apps/dostoevsky/src/ui/form/Option";
import { useEffect, useState } from "react";

type Props = {
	options: Omit<OptionProps, "onClick">[];
	onChange: (value: string) => void;
	showArrow?: boolean;
};

export const Select: React.FC<Props> = ({ options, onChange }) => {
	const [selectedOption, setSelectedOption] = useState(
		options.find((option) => option.isSelected) || options[0]
	);
	const [showOptions, toggle] = useToggle();

	useEffect(() => {
		onChange(selectedOption.value);
	}, [selectedOption]);

	return (
		<div className="relative flex flex-col items-center">
			<div onClick={toggle} className="flex cursor-pointer items-center gap-4">
				{selectedOption?.icon && <selectedOption.icon />}
				<p>{selectedOption?.displayText}</p>
			</div>
			{showOptions && (
				<div className="border-contrast-300 absolute top-0 mt-8 flex max-h-[150px] flex-col overflow-auto rounded border">
					{options.map((option, idx) => (
						<Option key={idx} onClick={() => setSelectedOption(option)} {...option} />
					))}
				</div>
			)}
		</div>
	);
};
