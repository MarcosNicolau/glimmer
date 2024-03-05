"use client";

import { User } from "@glimmer/bulgakov";
import { useModal } from "apps/dostoevsky/src/hooks/useModal";
import { LOCAL_STORAGE_KEYS } from "apps/dostoevsky/src/libs/constants";
import { useUserStore } from "apps/dostoevsky/src/state";
import { Input } from "apps/dostoevsky/src/ui/form/Input";
import { Modal, ModalForm } from "apps/dostoevsky/src/ui/modal";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const LoadUser: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const setUser = useUserStore((state) => state.setUser);
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<{ name: string; surname: string }>({ mode: "onTouched" });
	const { open, setOpen } = useModal();
	// We assume the user is created
	const [isUser, setIsUser] = useState(true);
	const t = useTranslations();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || "{}");
		const { success } = User.omit({ id: true }).safeParse(user);
		if (success) return setUser(user);
		setOpen(true);
		setIsUser(false);
	}, [setUser, setIsUser]);

	const onSubmit = (d: { name: string }) => {
		const user = { name: d.name, description: "", image: "", links: [] };
		setUser(user);
		localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
		setOpen(false);
	};

	return (
		<>
			{!isUser && (
				<Modal
					open={open}
					setOpen={setOpen}
					shouldCloseOnEsc={false}
					shouldCloseOnOutsideClick={false}
				>
					<ModalForm
						title={t("load-user-modal.title")}
						description={t("load-user-modal.description")}
						showCancelBtn={false}
						showCloseBtn={false}
						setOpen={setOpen}
						onSubmit={handleSubmit(onSubmit)}
						disabled={!isValid}
					>
						<Input
							placeholder={t("load-user-modal.name-input-placeholder")}
							autoComplete="name"
							error={errors.name?.message || !!errors.name}
							{...register("name", {
								required: { value: true, message: "" },
							})}
						/>
					</ModalForm>
				</Modal>
			)}
			{children}
		</>
	);
};
