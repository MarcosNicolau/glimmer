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
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const DesktopNavContent: React.FC = () => {
	const { isTablet } = useScreenType();
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
					"flex items-stretch justify-between gap-2 only-big-desktop:w-1/2 max-big-desktop:w-[70%]"
				)}
			>
				<div className="flex-1">
					<Input icon={SearchIcon} placeholder={t("nav.search-bar-placeholder")} />
				</div>
				<Button>{t("nav.create-room")}</Button>
			</div>
			<div className="flex flex-1 justify-end flex-row items-center gap-5">
				<ThemeSwitcher />
				<IconBtn icon={GithubIcon} />
				<LanguageSwitcher />
				{isTablet && <IconBtn icon={UserIcon} />}
			</div>
		</>
	);
};
