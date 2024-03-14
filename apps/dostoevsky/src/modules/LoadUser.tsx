"use client";

import { User } from "@glimmer/bulgakov";
import { useModal } from "@glimmer/hooks";
import { LOCAL_STORAGE_KEYS, NUM_AVATAR_IMGS } from "apps/dostoevsky/src/libs/constants";
import { useUserStore } from "apps/dostoevsky/src/state";
import { Input, Modal, ModalForm } from "@glimmer/ui/web/components";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getRandomIntBetween } from "@glimmer/utils";

type LoadUserForm = {
	name: string;
};

export const LoadUser: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { setUser, setIsLoaded } = useUserStore((state) => state);
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<LoadUserForm>({ mode: "onTouched" });
	const { open, setOpen } = useModal();
	const t = useTranslations();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || "{}");
		const userId = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID) || "";
		const { success } = User.omit({ roomId: true }).safeParse({ ...user, id: userId });

		if (success && userId) {
			setUser({ ...user, id: userId });
			setIsLoaded(true);
			return;
		}

		setOpen(true);
	}, [setUser]);

	const onSubmit = (d: LoadUserForm) => {
		const rndImage = `/avatars/${getRandomIntBetween(0, NUM_AVATAR_IMGS)}.jpg`;
		const user = { name: d.name, description: "", image: rndImage, links: [] };
		setUser(user);
		setIsLoaded(true);
		setOpen(false);
	};

	return (
		<>
			<Modal
				open={open}
				setOpen={setOpen}
				shouldCloseOnEsc={false}
				shouldCloseOnOutsideClick={false}
				showCloseButton={false}
			>
				<ModalForm
					title={t("load-user-modal.title")}
					description={t("load-user-modal.description")}
					btnText={t("forms.enter")}
					cancelBtnText={t("forms.cancel")}
					showCancelBtn={false}
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
						tabIndex={0}
					/>
				</ModalForm>
			</Modal>
			{children}
		</>
	);
};
