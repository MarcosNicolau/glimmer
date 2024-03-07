import { SvgProps } from "../Icons/Svg";
import clsx from "clsx";

export type Props = {
	icon?: React.FC<SvgProps>;
	value: string;
	text: string;
	isSelected: boolean;
	onClick: () => void;
};

export const Option: React.FC<Props> = ({ isSelected, onClick, text, icon: Icon }) => (
	<div
		className={clsx(
			"hover:bg-contrast-200 hover:fill-accent-100 fill-accent-200 hover:text-text-100 text-text-200 flex w-full cursor-pointer gap-4 px-4  py-2 transition",
			{
				"bg-contrast-200": isSelected,
				"bg-contrast-100": !isSelected,
			}
		)}
		onClick={onClick}
	>
		{Icon && (
			<Icon
				className={clsx({ "fill-accent-100": isSelected, "fill-inherit": !isSelected })}
			/>
		)}
		<p
			className={clsx("whitespace-nowrap  text-inherit transition", {
				"text-text-100 font-bold": isSelected,
			})}
		>
			{text}
		</p>
	</div>
);
