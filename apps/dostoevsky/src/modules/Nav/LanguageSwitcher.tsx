import { locales, localesFlagEmoji } from "apps/dostoevsky/src/libs/i18n";
import { usePathname, useRouter } from "apps/dostoevsky/src/libs/navigation";
import { Select } from "@glimmer/ui/web";
import { useLocale } from "next-intl";

export const LanguageSwitcher = () => {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const onSelectChange = (value: string) => {
		router.replace(pathname, { locale: value });
	};

	return (
		<Select
			onChange={onSelectChange}
			options={locales.map((_locale) => ({
				isSelected: _locale === locale,
				text: `${localesFlagEmoji[_locale]} ${_locale}`,
				value: _locale,
				textWhenSelected: localesFlagEmoji[_locale],
			}))}
			variant="no-fill"
		/>
	);
};
