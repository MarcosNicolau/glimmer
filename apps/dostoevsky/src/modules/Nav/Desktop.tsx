"use client";

import { useScreenType } from "@glimmer/hooks";
import { IconBtn, Input, GithubIcon, LogoIcon, SearchIcon } from "@glimmer/ui/web";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { UserProfile } from "apps/dostoevsky/src/modules/Nav/UserProfile";
import { useRouting } from "apps/dostoevsky/src/hooks/useRouting";
import { LINKS, ROUTES } from "apps/dostoevsky/src/libs/constants";
import { Link } from "apps/dostoevsky/src/libs/navigation";

export const DesktopNavContent: React.FC = () => {
	const { isBigDesktop } = useScreenType();
	const t = useTranslations();
	const { pushRoute, openWindowAt } = useRouting();

	return (
		<>
			<div className="flex-1">
				<LogoIcon
					height={50}
					width={50}
					className="cursor-pointer"
					onClick={pushRoute(ROUTES.HOME)}
				/>
			</div>
			<div
				className={clsx(
					"only-big-desktop:w-1/2 max-big-desktop:w-[70%] flex items-stretch justify-between gap-2"
				)}
			>
				<div className="flex-1">
					<Input icon={SearchIcon} placeholder={t("nav.search-bar-placeholder")} />
				</div>
			</div>
			<div className="max-big-desktop:gap-4 flex flex-1 flex-row items-center justify-end gap-5">
				<ThemeSwitcher />
				<Link
					href={LINKS.GITHUB}
					onClick={openWindowAt(LINKS.GITHUB)}
					className="leading-none"
				>
					<IconBtn icon={GithubIcon} />
				</Link>
				<LanguageSwitcher />
				{!isBigDesktop && <UserProfile />}
			</div>
		</>
	);
};
