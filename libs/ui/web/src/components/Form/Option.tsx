import { SvgProps } from "../Icons/Svg";
import clsx from "clsx";

export type Props = {
	icon?: React.FC<SvgProps>;
	image?: React.ReactNode;
	text?: string;
	value: string;
	isSelected: boolean;
	selectedClassName?: string;
	onClick: () => void;
};

export const Option: React.FC<Props> = ({
	isSelected,
	onClick,
	text,
	icon: Icon,
	image,
	selectedClassName,
}) => (
	<div
		className={clsx(
			"fill-accent-200  text-text-200  flex cursor-pointer gap-4 rounded px-4  py-2 transition",
			{
				"bg-contrast-200": isSelected,
				"hover:bg-contrast-200 hover:text-text-100 hover:fill-accent-100": !isSelected,
			},
			isSelected && selectedClassName
		)}
		onClick={onClick}
	>
		{Icon && (
			<Icon
				className={clsx({ "fill-accent-100": isSelected, "fill-inherit": !isSelected })}
			/>
		)}
		{image && image}
		{text && (
			<p
				className={clsx("whitespace-nowrap  text-inherit transition", {
					"text-text-100 font-bold": isSelected,
				})}
			>
				{text}
			</p>
		)}
	</div>
);
