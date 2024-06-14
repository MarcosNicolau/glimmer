import { LocalesUnion } from "apps/dostoevsky/src/libs/i18n";
import "next-intl";

declare module "next-intl" {
	export function useLocale(): LocalesUnion;
}
