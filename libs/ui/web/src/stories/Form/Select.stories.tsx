import { ComputerIcon, MoonIcon, Select, SunIcon } from "@glimmer/ui/web/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
	component: Select,
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Text: Story = {
	args: {
		options: [
			{
				isSelected: true,
				text: "Dark",
				displayText: "Dark",
				value: "Dark",
			},
			{
				isSelected: false,
				text: "Sun",
				displayText: "Light",
				value: "Light",
			},
			{
				isSelected: false,
				text: "Computer",
				displayText: "Computer",
				value: "System",
			},
		],
		variant: "filled",
		showArrow: true,
		matchOptionsWidth: true,
		onChange: () => null,
	},
};

export const TextAndIcon: Story = {
	args: {
		options: [
			{
				isSelected: true,
				text: "Dark",
				displayText: "Dark",
				icon: MoonIcon,
				value: "Dark",
			},
			{
				isSelected: false,
				text: "Sun",
				displayText: "Sun",
				icon: SunIcon,
				value: "Dark",
			},
			{
				isSelected: false,
				text: "System",
				displayText: "System",
				icon: ComputerIcon,
				value: "System",
			},
		],
		variant: "filled",
		showArrow: true,
		matchOptionsWidth: true,
		onChange: () => null,
	},
};

export const WithOnlyIcon: Story = {
	args: {
		options: [
			{
				isSelected: true,
				text: "Dark",
				displayText: "",
				icon: MoonIcon,
				value: "Dark",
			},
			{
				isSelected: false,
				text: "Sun",
				displayText: "",
				icon: SunIcon,
				value: "Dark",
			},
			{
				isSelected: false,
				text: "System",
				displayText: "",
				icon: ComputerIcon,
				value: "System",
			},
		],
		variant: "no-fill",
		showArrow: false,
		onChange: () => null,
	},
};
