import { abrilFatface, inter } from "apps/dostoevsky/src/libs/loadFonts";
import { Nav } from "apps/dostoevsky/src/modules/Nav";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Providers } from "apps/dostoevsky/src/providers";
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
		<html
			suppressHydrationWarning
			lang={locale}
			className={`${inter.variable} ${abrilFatface.variable}`}
		>
			<body className="mobile:p-6 flex flex-col items-center p-10 ">
				<div className="app w-full max-w-[1400px]">
					<Providers>
						<NextIntlClientProvider locale={locale} messages={messages}>
							<Nav />
							<Auth>
								<LoadUser>
									<ConnectToWs>{children}</ConnectToWs>
								</LoadUser>
							</Auth>
						</NextIntlClientProvider>
					</Providers>
				</div>
			</body>
		</html>
	);
};

export const metadata = {
	title: "Welcome to dostoevsky",
	description: "",
};

export default RootLayout;
