import { AppSvg, SvgProps } from "libs/ui/web/src/components/Icons/Svg";

export const PlusIcon = (props: SvgProps) => (
	<AppSvg viewBox="0 0 16 16" {...props}>
		<path
			fillRule="evenodd"
			d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"
		/>
	</AppSvg>
);
