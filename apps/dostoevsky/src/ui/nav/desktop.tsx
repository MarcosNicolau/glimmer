"use client";
import { useScreenType } from "apps/dostoevsky/src/hooks/useScreenType";
import { IconBtn } from "apps/dostoevsky/src/ui/btns/Icon";
import { Button } from "apps/dostoevsky/src/ui/btns/btn";
import { Input } from "apps/dostoevsky/src/ui/form/input";
import { GithubIcon, LogoIcon, MoonIcon, SearchIcon } from "apps/dostoevsky/src/ui/icons";
import clsx from "clsx";
import Link from "next/link";

export const DesktopNavContent: React.FC = () => {
	const { isTablet, isDesktop } = useScreenType();

	return (
		<>
			<Link href="/">
				<LogoIcon height={50} width={50} />
			</Link>
			<div
				className={clsx("flex w-1/2 items-stretch  justify-between gap-2", {
					"w-1/2": isDesktop,
					"w-3/4": isTablet,
				})}
			>
				<div className="flex-1">
					<Input icon={SearchIcon} placeholder="Search for rooms, users, categories" />
				</div>
				<Button>Create room</Button>
			</div>
			<div className="flex flex-row gap-5 align-middle">
				<IconBtn icon={MoonIcon} />
				<IconBtn icon={GithubIcon} />
			</div>
		</>
	);
};
