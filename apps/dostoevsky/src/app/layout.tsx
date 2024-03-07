import "@glimmer/ui/web/globals.css";
import { Providers } from "apps/dostoevsky/src/providers";
import { abrilFatface, inter } from "apps/dostoevsky/src/libs/loadFonts";

export default ({ children }: { children: React.ReactNode }) => (
	<html suppressHydrationWarning className={`${inter.variable} ${abrilFatface.variable}`}>
		<body className="mobile:p-6 flex flex-col items-center p-10 ">
			<div className="app w-full max-w-[1400px]">
				<Providers>{children}</Providers>
			</div>
		</body>
	</html>
);
