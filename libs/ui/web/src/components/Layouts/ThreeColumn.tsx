"use client";
import { useScreenType } from "@glimmer/hooks";

type Props = React.PropsWithChildren<{
	leftComponent: React.ReactNode;
	leftSideBar: React.ReactNode;
	rightComponent: React.ReactNode;
}>;

export const ThreeColumnLayout: React.FC<Props> = ({
	leftSideBar,
	leftComponent,
	rightComponent,
	children,
}) => {
	const { isTablet, isMobile, isBigDesktop } = useScreenType();

	return (
		<div className="flex h-full overflow-hidden px-10 justify-between">
			{!isTablet && !isMobile && (
				<aside className="only-big-desktop:w-[20%] w-[10%]">
					{isBigDesktop ? leftComponent : leftSideBar}
				</aside>
			)}
			<main className="only-big-desktop:w-[50%] w-[70%] max-tablet:w-[100%]">{children}</main>
			{!isTablet && !isMobile && (
				<aside className="only-big-desktop:w-[20%] w-[10%]">
					{isBigDesktop && rightComponent}
				</aside>
			)}
		</div>
	);
};
