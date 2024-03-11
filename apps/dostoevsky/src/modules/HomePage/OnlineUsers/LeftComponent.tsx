"use client";
import { Card } from "@glimmer/ui/web/components";
import { useOnlineUsers } from "apps/dostoevsky/src/hooks/useOnlineUsers";
import { OnlineUser } from "apps/dostoevsky/src/modules/OnlineUser";
import { useTranslations } from "next-intl";

export const LeftComponent = () => {
	const t = useTranslations();
	const { users } = useOnlineUsers();

	return (
		<Card className="p-6">
			<div className="mb-8">
				<h5 className="mb-1">{t("online-users.header")}</h5>
				<p className="small">{t("online-users.subtitle", { num: 24000 })}</p>
			</div>
			<div className="flex flex-col max-big-desktop:items-center gap-7">
				{users?.map((user) => <OnlineUser key={user.id} {...user} />)}
			</div>
		</Card>
	);
};
