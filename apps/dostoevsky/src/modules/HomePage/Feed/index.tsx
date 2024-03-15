"use client";

import { useModal } from "@glimmer/hooks";
import { Button } from "@glimmer/ui/web";
import { CreateRoomFormModal } from "apps/dostoevsky/src/modules/HomePage/Feed/CreateRoom";
import { useTranslations } from "next-intl";

export const Feed = () => {
	const { open, setOpen, toggleOpen } = useModal();
	const t = useTranslations("feed");

	return (
		<>
			<CreateRoomFormModal open={open} setOpen={setOpen} />
			<div className="mb-6 flex items-center justify-between">
				<h4>{t("header")}</h4>
				<Button onClick={toggleOpen}>{t("create-room-btn")}</Button>
			</div>
		</>
	);
};
