import { redirect } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export type LocalesUnion = "en" | "es";

export const locales: LocalesUnion[] = ["en", "es"];

export const localesFlagEmoji: { [key in LocalesUnion]: string } = {
	en: "🇬🇧",
	es: "🇪🇸",
};

export default getRequestConfig(async ({ locale }) => {
	// Validate that the incoming `locale` parameter is valid
	if (!locales.includes(locale as any)) redirect(`/en`);

	return {
		messages: (await import(`../../locales/${locale}.json`)).default,
	};
});
