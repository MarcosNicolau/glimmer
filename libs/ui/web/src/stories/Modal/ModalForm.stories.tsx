import { Input, Modal, ModalForm } from "@glimmer/ui/web";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ModalForm> = {
	component: ModalForm,
	tags: [],
	parameters: {
		docs: { disable: true },
	},
};
export default meta;

type Story = StoryObj<typeof ModalForm>;

export const Primary: Story = {
	decorators: (Story) => (
		<Modal open={true} setOpen={() => null}>
			<Story />
		</Modal>
	),
	args: {
		title: "Example form",
		description: "This is just an example for storybooks",
		onSubmit: () => null,
		btnText: "Enter",
		cancelBtnText: "Cancel",
		showCancelBtn: true,
		showCloseBtn: true,
		disabled: false,
		isLoading: false,
		children: (
			<>
				<Input error="Min 10" value="What the" placeholder="Input 1" />
				<Input error="" placeholder="Input 2" />
				<Input error="" placeholder="Input 3" />
			</>
		),
	},
	parameters: {
		controls: {
			exclude: "children",
		},
	},
};
