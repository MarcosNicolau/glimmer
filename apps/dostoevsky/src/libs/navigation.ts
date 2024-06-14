import { locales } from "apps/dostoevsky/src/libs/i18n";
import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
	locales,
});
