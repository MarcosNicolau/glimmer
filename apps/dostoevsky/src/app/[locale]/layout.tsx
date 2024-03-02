import { abrilFatface, inter } from "apps/dostoevsky/src/libs/loadFonts";
import { Nav } from "apps/dostoevsky/src/ui/nav";
import "apps/dostoevsky/src/styles/globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";

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
			lang={locale}
			data-theme="light"
			className={`${inter.variable} ${abrilFatface.variable}`}
		>
			<body className="mobile:p-6 flex flex-col items-center p-10 ">
				<div className="app w-full max-w-[1400px]">
					<NextIntlClientProvider locale={locale} messages={messages}>
						<Nav />
						{children}
					</NextIntlClientProvider>
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
