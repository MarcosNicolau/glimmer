import "@glimmer/ui/web/globals.css";
import { Providers } from "apps/dostoevsky/src/providers";
import { abrilFatface, inter } from "apps/dostoevsky/src/libs/loadFonts";

export default ({ children }: { children: React.ReactNode }) => (
	<html suppressHydrationWarning className={`${inter.variable} ${abrilFatface.variable}`}>
		<body className="tablet:p-6 flex flex-col items-center h-screen">
			<div className="app w-full max-w-[1440px] h-full overflow-hidden p-10 flex-grow flex flex-col">
				<Providers>{children}</Providers>
			</div>
		</body>
	</html>
);
