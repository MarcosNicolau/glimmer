"use client";
import { useToggle } from "@glimmer/hooks";
import {
	Input,
	IconBtn,
	ArrowIcon,
	LogoIcon,
	MoonIcon,
	SearchIcon,
	UserGroupIcon,
	UserIcon,
} from "@glimmer/ui/web/components";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { OnlineUsers } from "./OnlineUsers";

export const MobileNavContent: React.FC = () => {
	const [isSearch, toggleIsSearch] = useToggle(false);
	const [isOnlineUsers, toggleOnlineUsers, setIsOnlineUsers] = useToggle(false);
	const t = useTranslations();

	if (isSearch)
		return (
			<div className="flex w-full gap-5">
				<IconBtn onClick={toggleIsSearch} icon={() => <ArrowIcon direction="left" />} />
				<div className="w-full">
					<Input icon={SearchIcon} placeholder={t("nav.search-bar-placeholder")} />
				</div>
			</div>
		);

	return (
		<>
			<OnlineUsers open={isOnlineUsers} setOpen={setIsOnlineUsers} />
			<div className="flex gap-6">
				<IconBtn icon={UserGroupIcon} onClick={toggleOnlineUsers} />
				<Link href="/">
					<LogoIcon height={28} width={28} />
				</Link>
			</div>
			<div className="flex gap-6">
				<IconBtn icon={SearchIcon} onClick={toggleIsSearch} />
				<IconBtn icon={MoonIcon} />
				<IconBtn icon={UserIcon} />
				<LanguageSwitcher />
			</div>
		</>
	);
};
