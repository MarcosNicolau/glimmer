import { Nav } from "apps/dostoevsky/src/modules/Nav";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Auth } from "apps/dostoevsky/src/modules/Auth";
import { LoadUser } from "apps/dostoevsky/src/modules/LoadUser";
import { ConnectToWs } from "apps/dostoevsky/src/modules/ConnectToWs";

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
					<ConnectToWs>{children}</ConnectToWs>
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
