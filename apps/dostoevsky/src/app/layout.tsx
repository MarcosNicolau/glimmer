import "../styles/globals.css";
import { abrilFatface, inter } from "../libs/loadFonts";
import { Nav } from "apps/dostoevsky/src/ui/nav";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html data-theme="light" className={`${inter.variable} ${abrilFatface.variable}`}>
			<body className="flex flex-col items-center p-10 ">
				<div className="app w-full max-w-[1400px]">
					<Nav />
					{children}
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
