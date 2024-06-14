import { Abril_Fatface, Inter } from "next/font/google";

export const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	weight: ["500", "700"],
	variable: "--font-inter",
});

export const abrilFatface = Abril_Fatface({
	subsets: ["latin"],
	weight: "400",
	display: "swap",
	variable: "--font-abril",
});
