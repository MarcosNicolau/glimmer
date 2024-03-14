import "@glimmer/ui/web/globals.css";
import { Providers } from "apps/dostoevsky/src/providers";
import { abrilFatface, inter } from "apps/dostoevsky/src/libs/loadFonts";
import { ToastContainer } from "apps/dostoevsky/src/modules/Toasts";

export default ({ children }: { children: React.ReactNode }) => (
	<html suppressHydrationWarning className={`${inter.variable} ${abrilFatface.variable}`}>
		<body className="tablet:p-6 flex h-screen flex-col items-center">
			<div className="app relative flex h-full w-full max-w-[1440px] flex-grow flex-col overflow-hidden py-10">
				<ToastContainer />
				<Providers>{children}</Providers>
			</div>
		</body>
	</html>
);
