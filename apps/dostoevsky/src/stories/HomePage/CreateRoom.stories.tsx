import type { Meta, StoryObj } from "@storybook/react";
import { CreateRoomFormModal } from "apps/dostoevsky/src/modules/HomePage/Feed/CreateRoom";

const meta: Meta = {
	component: CreateRoomFormModal,
};
export default meta;

type Story = StoryObj<typeof CreateRoomFormModal>;

export const Default: Story = {
	args: { open: true, setOpen: () => null },
};
