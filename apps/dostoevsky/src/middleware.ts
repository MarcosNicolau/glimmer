import { defaultLang, locales } from "apps/dostoevsky/src/libs/i18n";
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
	// A list of all locales that are supported
	locales,
	// Used when no locale matches
	defaultLocale: defaultLang,
});

export const config = {
	// Match all pathnames except for
	// - if they start with `/api`, `/_next` or `/_vercel`
	// - the ones containing a dot (e.g. `favicon.ico`)
	// - static files
	matcher: "/((?!api|static|.*\\..*|_next).*)",
};
