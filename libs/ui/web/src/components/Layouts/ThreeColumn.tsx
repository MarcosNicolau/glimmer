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
		<div className="max-mobile:px-6 flex h-full justify-between overflow-hidden px-10">
			{!isTablet && !isMobile && (
				<aside className="only-big-desktop:w-[20%] w-[10%]">
					{isBigDesktop ? leftComponent : leftSideBar}
				</aside>
			)}
			<main className="only-big-desktop:w-[50%] max-tablet:w-[100%] h-full w-[70%] overflow-auto">
				{children}
			</main>
			{!isTablet && !isMobile && (
				<aside className="only-big-desktop:w-[20%] w-[10%]">
					{isBigDesktop && rightComponent}
				</aside>
			)}
		</div>
	);
};
