"use client";
import { useScreenType } from "@glimmer/hooks";

type Props = React.PropsWithChildren<{
	leftComponent: React.ReactNode;
	rightComponent: React.ReactNode;
}>;

export const ThreeColumnLayout: React.FC<Props> = ({ leftComponent, rightComponent, children }) => {
	const { isTablet, isMobile } = useScreenType();

	return (
		<div className="flex gap items-center justify-between desktop:gap-10 tablet:gap-2">
			{!isTablet && !isMobile && <aside className="flex-1">{leftComponent}</aside>}
			<main className="w-1/2 tablet:w-[100%]">{children}</main>
			{!isTablet && !isMobile && <aside className="flex-1">{rightComponent}</aside>}
		</div>
	);
};
