import { IconBtn, Select, MoonIcon, SunIcon, ComputerIcon } from "@glimmer/ui/web";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export const ThemeSwitcher = () => {
	const { setTheme, theme, resolvedTheme } = useTheme();
	const t = useTranslations();
	const [mounted, setMounted] = useState(false);

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}
	return (
		<div className="relative flex justify-center">
			<Select
				onChange={(theme) => setTheme(theme)}
				options={[
					{
						value: "system",
						text: t("nav.theme-switcher.system"),
						icon: ComputerIcon,
						isSelected: theme === "system",
					},
					{
						value: "light",
						text: t("nav.theme-switcher.light"),
						icon: SunIcon,
						isSelected: theme === "light",
					},
					{
						value: "dark",
						text: t("nav.theme-switcher.dark"),
						icon: MoonIcon,
						isSelected: theme === "dark",
					},
				]}
				variant="no-fill"
				selectedRender={() => (
					<IconBtn icon={resolvedTheme === "dark" ? MoonIcon : SunIcon} />
				)}
			></Select>
		</div>
	);
};
