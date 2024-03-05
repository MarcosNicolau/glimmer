"use client";

import { useScreenType } from "apps/dostoevsky/src/hooks/useScreenType";
import { IconBtn } from "apps/dostoevsky/src/ui/btns/Icon";
import { Button } from "apps/dostoevsky/src/ui/btns/btn";
import { Input } from "apps/dostoevsky/src/ui/form/Input";
import { GithubIcon, LogoIcon, SearchIcon, UserIcon } from "apps/dostoevsky/src/ui/icons";
import { LanguageSwitcher } from "apps/dostoevsky/src/ui/nav/LanguageSwitcher";
import { ThemeSwitcher } from "apps/dostoevsky/src/ui/nav/ThemeSwitcher";
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
