import clsx from "clsx";

export const Card: React.FC<React.ComponentProps<"div">> = ({ children, className, ...props }) => (
	<div
		className={clsx("bg-contrast-100 max-mobile:p-8 relative rounded-l p-10", className)}
		{...props}
	>
		{children}
	</div>
);
