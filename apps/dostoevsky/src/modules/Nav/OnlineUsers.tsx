import { Card, Drawer, IconBtn, InfiniteQueryLoader, UserGroupIcon } from "@glimmer/ui/web";
import { useElementOnView } from "apps/dostoevsky/src/hooks/useElementOnView";
import { useOnlineUsers, useOnlineUsersCount } from "apps/dostoevsky/src/hooks/useOnlineUsers";
import { OnlineUser } from "apps/dostoevsky/src/modules/OnlineUsers";
import { useTranslations } from "next-intl";
import { Dispatch } from "react";

type Props = {
	open: boolean;
	setOpen: Dispatch<React.SetStateAction<boolean>>;
};

export const OnlineUsers: React.FC<Props> = ({ open, setOpen }) => {
	const t = useTranslations();
	const { users, fetchNextPage, isFetchingNextPage } = useOnlineUsers();
	const { count, isLoading: userCountLoading } = useOnlineUsersCount();
	const [ref] = useElementOnView<HTMLDivElement>(async () => {
		fetchNextPage();
	}, {});

	return (
		<Drawer open={open}>
			<Card>
				<div className="mb-8">
					<div className="flex justify-between">
						<h5 className="mb-1">{t("online-users.header")}</h5>
						<IconBtn icon={UserGroupIcon} onClick={() => setOpen(false)} />
					</div>
					<p className="small">
						{t("online-users.subtitle", { num: userCountLoading ? "..." : count })}
					</p>
				</div>
				<div className="flex flex-col  gap-7">
					{users?.map((user) => <OnlineUser key={user.id} {...user} />)}
				</div>
				<InfiniteQueryLoader ref={ref} isFetching={isFetchingNextPage} />
			</Card>
		</Drawer>
	);
};
