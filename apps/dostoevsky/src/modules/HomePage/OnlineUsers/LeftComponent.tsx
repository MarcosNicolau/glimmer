"use client";
import { Card, InfiniteQueryLoader } from "@glimmer/ui/web";
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
		<Card className="h-full overflow-auto p-6">
			<div className="mb-8">
				<h5 className="mb-1">{t("online-users.header")}</h5>
				<p className="small">
					{t("online-users.subtitle", { num: userCountLoading ? "..." : count })}
				</p>
			</div>
			{isLoading ? (
				<h4>Loading...</h4>
			) : (
				<div className="max-big-desktop:items-center flex flex-col gap-7">
					{users.map((user) => (
						<OnlineUser key={user.id} {...user} />
					))}

					<InfiniteQueryLoader ref={ref} isFetching={isFetchingNextPage} />
				</div>
			)}
		</Card>
	);
};
