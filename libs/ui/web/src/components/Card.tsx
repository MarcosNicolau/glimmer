import clsx from "clsx";

export const Card: React.FC<React.ComponentProps<"div">> = ({ children, className, ...props }) => (
	<div className={clsx("relative rounded-l bg-contrast-100 p-10", className)} {...props}>
		{children}
	</div>
);
