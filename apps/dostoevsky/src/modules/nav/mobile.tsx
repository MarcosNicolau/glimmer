"use client";
import { useToggle } from "@glimmer/hooks";
import {
	Input,
	IconBtn,
	ArrowIcon,
	CreateRoomIcon,
	LogoIcon,
	MoonIcon,
	SearchIcon,
	UserGroupIcon,
	UserIcon,
} from "@glimmer/ui/web/components";
import { LanguageSwitcher } from "apps/dostoevsky/src/modules/nav/LanguageSwitcher";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const MobileNavContent: React.FC = () => {
	const [isSearch, toggle] = useToggle(false);
	const t = useTranslations();

	if (isSearch)
		return (
			<div className="flex w-full gap-5">
				<IconBtn onClick={toggle} icon={() => <ArrowIcon direction="left" />} />
				<div className="w-full">
					<Input icon={SearchIcon} placeholder={t("nav.search-bar-placeholder")} />
				</div>
			</div>
		);

	return (
		<>
			<div className="flex gap-6">
				<IconBtn icon={UserGroupIcon} />
				<Link href="/">
					<LogoIcon height={28} width={28} />
				</Link>
			</div>
			<div className="flex gap-6">
				<IconBtn icon={SearchIcon} onClick={toggle} />
				<IconBtn icon={CreateRoomIcon} />
				<IconBtn icon={MoonIcon} />
				<IconBtn icon={UserIcon} />
				<LanguageSwitcher />
			</div>
		</>
	);
};
