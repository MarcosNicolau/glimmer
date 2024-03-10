import { Card, Drawer, IconBtn, UserGroupIcon } from "@glimmer/ui/web/components";
import { useOnlineUsers } from "apps/dostoevsky/src/hooks/useOnlineUsers";
import { OnlineUser } from "apps/dostoevsky/src/modules/OnlineUser";
import { useTranslations } from "next-intl";
import { Dispatch } from "react";

type Props = {
	open: boolean;
	setOpen: Dispatch<React.SetStateAction<boolean>>;
};

export const OnlineUsers: React.FC<Props> = ({ open, setOpen }) => {
	const t = useTranslations();
	const { users } = useOnlineUsers();
	return (
		<Drawer open={open}>
			<Card>
				<div className="mb-8">
					<div className="flex justify-between">
						<h5 className="mb-1">{t("online-users.header")}</h5>
						<IconBtn icon={UserGroupIcon} onClick={() => setOpen(false)} />
					</div>
					<p className="small">{t("online-users.subtitle", { num: 24000 })}</p>
				</div>
				<div className="flex flex-col  gap-7">
					{users?.map((user) => <OnlineUser key={user.id} {...user} />)}
				</div>
			</Card>
		</Drawer>
	);
};
