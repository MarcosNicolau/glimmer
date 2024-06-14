import { ComputerIcon, MoonIcon, Select, SunIcon } from "@glimmer/ui/web";
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
				value: "Dark",
			},
			{
				isSelected: false,
				text: "Sun",
				value: "Light",
			},
			{
				isSelected: false,
				text: "Computer",
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
				icon: MoonIcon,
				value: "Dark",
			},
			{
				isSelected: false,
				text: "Sun",
				icon: SunIcon,
				value: "Dark",
			},
			{
				isSelected: false,
				text: "System",
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
				icon: MoonIcon,
				value: "Dark",
			},
			{
				isSelected: false,
				text: "Sun",
				icon: SunIcon,
				value: "Dark",
			},
			{
				isSelected: false,
				text: "System",
				icon: ComputerIcon,
				value: "System",
			},
		],
		variant: "no-fill",
		showArrow: false,
		onChange: () => null,
	},
};
