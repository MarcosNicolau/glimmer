import dynamic from "next/dynamic";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Auth } from "apps/dostoevsky/src/modules/Auth";
import { LoadUser } from "apps/dostoevsky/src/modules/LoadUser";
import { ConnectToWs } from "apps/dostoevsky/src/modules/ConnectToWs";
import { RoomConnection } from "apps/dostoevsky/src/providers/RoomConn";

const Nav = dynamic(() => import("../../modules/Nav"), {
	ssr: false,
});

const RootLayout = ({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) => {
	const messages = useMessages();

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<Nav />
			<Auth>
				<LoadUser>
					<ConnectToWs>
						<RoomConnection>{children}</RoomConnection>
					</ConnectToWs>
				</LoadUser>
			</Auth>
		</NextIntlClientProvider>
	);
};

export const metadata = {
	title: "Welcome to dostoevsky",
	description: "",
};

export default RootLayout;
