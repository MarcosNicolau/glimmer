"use client";

import { useScreenType } from "@glimmer/hooks";
import { IconBtn, Input, GithubIcon, LogoIcon, SearchIcon } from "@glimmer/ui/web";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { UserProfile } from "apps/dostoevsky/src/modules/Nav/UserProfile";

export const DesktopNavContent: React.FC = () => {
	const { isBigDesktop } = useScreenType();
	const t = useTranslations();

	return (
		<>
			<div className="flex-1">
				<Link href="/">
					<LogoIcon height={50} width={50} />
				</Link>
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
				<IconBtn icon={GithubIcon} />
				<LanguageSwitcher />
				{!isBigDesktop && <UserProfile />}
			</div>
		</>
	);
};
