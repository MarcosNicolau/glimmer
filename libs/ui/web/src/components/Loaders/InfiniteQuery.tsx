import clsx from "clsx";
import { Spinner } from "libs/ui/web/src/components/Loaders";
import React from "react";

type Props = React.ComponentProps<"div"> & {
	isFetching: boolean;
};

export const InfiniteQueryLoader = React.forwardRef<HTMLDivElement, Props>(
	({ isFetching, className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={clsx("flex flex-1 items-center justify-center", className)}
				{...props}
			>
				{isFetching && <Spinner />}
			</div>
		);
	}
);
