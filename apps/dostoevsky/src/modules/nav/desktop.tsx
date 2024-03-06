"use client";

import { useScreenType } from "@glimmer/hooks";
import {
	IconBtn,
	Button,
	Input,
	GithubIcon,
	LogoIcon,
	SearchIcon,
	UserIcon,
} from "@glimmer/ui/web/components";
import { LanguageSwitcher } from "apps/dostoevsky/src/modules/nav/LanguageSwitcher";
import { ThemeSwitcher } from "apps/dostoevsky/src/modules/nav/ThemeSwitcher";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const DesktopNavContent: React.FC = () => {
	const { isTablet, isDesktop } = useScreenType();
	const t = useTranslations();

	return (
		<>
			<Link href="/">
				<LogoIcon height={50} width={50} />
			</Link>
			<div
				className={clsx("flex w-1/2 items-stretch justify-between gap-2", {
					"w-1/2": isDesktop,
					"w-3/4": isTablet,
				})}
			>
				<div className="flex-1">
					<Input icon={SearchIcon} placeholder={t("nav.search-bar-placeholder")} />
				</div>
				<Button>{t("nav.create-room")}</Button>
			</div>
			<div className="flex flex-row items-center gap-5">
				<ThemeSwitcher />
				<IconBtn icon={GithubIcon} />
				<LanguageSwitcher />
				{isTablet && <IconBtn icon={UserIcon} />}
			</div>
		</>
	);
};