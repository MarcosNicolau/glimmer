import clsx from "clsx";

export type SvgProps = React.SVGProps<SVGSVGElement>;

export const AppSvg: React.FC<SvgProps> = ({ children, className, ...props }) => (
	<svg
		viewBox="0 0 24 24"
		height={24}
		width={24}
		className={clsx("fill-accent-100", className)}
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		{children}
	</svg>
);
