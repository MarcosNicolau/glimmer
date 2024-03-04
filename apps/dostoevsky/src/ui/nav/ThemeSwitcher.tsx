import { IconBtn } from "apps/dostoevsky/src/ui/btns/Icon";
import { Select } from "apps/dostoevsky/src/ui/form/Selector";
import { MoonIcon, SunIcon, ComputerIcon } from "apps/dostoevsky/src/ui/icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeSwitcher = () => {
	const { setTheme, resolvedTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}
	return (
		<div className="relative">
			<Select
				onChange={(theme) => setTheme(theme)}
				options={[
					{
						value: "system",
						text: "system",
						icon: ComputerIcon,
						isSelected: theme === "system",
					},
					{ value: "light", text: "light", icon: SunIcon, isSelected: theme === "light" },
					{ value: "dark", text: "dark", icon: MoonIcon, isSelected: theme === "dark" },
				]}
			>
				<IconBtn icon={resolvedTheme === "dark" ? MoonIcon : SunIcon} />
			</Select>
		</div>
	);
};
