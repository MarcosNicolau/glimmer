import { AppSvg, SvgProps } from "libs/ui/web/src/components/Icons/Svg";

export const FilledArrowIcon: React.FC<SvgProps> = (props) => (
	<AppSvg width={10} height={6} viewBox="0 0 10 6" {...props}>
		<path d="M0 0.5L5 5.5L10 0.5H0Z" />
	</AppSvg>
);
