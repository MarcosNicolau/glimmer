"use client";
import { Card, Spinner } from "@glimmer/ui/web/components";
import { useElementOnView } from "apps/dostoevsky/src/hooks/useElementOnView";
import { useOnlineUsers, useOnlineUsersCount } from "apps/dostoevsky/src/hooks/useOnlineUsers";
import { OnlineUser } from "apps/dostoevsky/src/modules/OnlineUser";
import { useTranslations } from "next-intl";

export const LeftComponent = () => {
	const t = useTranslations();
	const { users, fetchNextPage, isFetchingNextPage, isLoading } = useOnlineUsers();
	const { count, isLoading: userCountLoading } = useOnlineUsersCount();
	const [ref] = useElementOnView<HTMLDivElement>(() => {
		fetchNextPage();
	}, {});

	return (
		<Card className="p-6 h-full overflow-auto">
			<div className="mb-8">
				<h5 className="mb-1">{t("online-users.header")}</h5>
				<p className="small">
					{t("online-users.subtitle", { num: userCountLoading ? "..." : count })}
				</p>
			</div>
			{isLoading ? (
				<h4>Loading...</h4>
			) : (
				<div className="flex flex-col max-big-desktop:items-center gap-7">
					{users.map((user) => (
						<OnlineUser key={user.id} {...user} />
					))}
					<div ref={ref} className="flex-1 flex items-center justify-center">
						{isFetchingNextPage && <Spinner />}
					</div>
				</div>
			)}
		</Card>
	);
};
