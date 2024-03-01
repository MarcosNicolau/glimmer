"use client";
import { useToggle } from "apps/dostoevsky/src/hooks/useToggle";
import { IconBtn } from "apps/dostoevsky/src/ui/btns/Icon";
import { Input } from "apps/dostoevsky/src/ui/form/input";
import {
	Arrow,
	CreateRoomIcon,
	LogoIcon,
	MoonIcon,
	SearchIcon,
	UserGroupIcon,
	UserIcon,
} from "apps/dostoevsky/src/ui/icons";
import Link from "next/link";

export const MobileNavContent: React.FC = () => {
	const [isSearch, toggle] = useToggle(false);

	if (isSearch)
		return (
			<div className="flex w-full gap-5">
				<IconBtn onClick={toggle} icon={() => <Arrow direction="left" />} />
				<div className="w-full">
					<Input icon={SearchIcon} placeholder="Search for rooms, users, categories" />
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
			</div>
		</>
	);
};
