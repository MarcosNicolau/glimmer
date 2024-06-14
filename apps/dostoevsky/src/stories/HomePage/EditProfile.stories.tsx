import { EditMyProfile } from "../../modules/EditMyProfile/index";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
	component: EditMyProfile,
};
export default meta;

type Story = StoryObj<typeof EditMyProfile>;

export const Default: Story = {
	args: {},
	decorators: (Story) => {
		return (
			<div className="app flex w-full items-center justify-center">
				<Story />
			</div>
		);
	},
};
