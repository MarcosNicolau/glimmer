import { USER_DESCRIPTION_MAX_LENGTH } from "@glimmer/bulgakov";
import { useToggle } from "@glimmer/hooks";
import { Input } from "@glimmer/ui/web";
import { EditAvatar } from "apps/dostoevsky/src/modules/EditMyProfile/Avatar";
import { EditSocialLinks } from "apps/dostoevsky/src/modules/EditMyProfile/EditSocialLinks";
import { EditMyProfileForm } from "apps/dostoevsky/src/modules/EditMyProfile/types";
import { useToastsStore, useUserStore } from "apps/dostoevsky/src/state";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

export const EditMyProfile = () => {
	const { isLoaded, setUser, ...user } = useUserStore((state) => {
		const { setIsLoaded, id, ...rest } = state;
		return rest;
	});
	const { addToast } = useToastsStore();
	const [isDescriptionFocused, toggleDescriptionFocused] = useToggle();
	const form = useForm<EditMyProfileForm>({
		mode: "onTouched",
	});
	const t = useTranslations();
	const description = form.watch("description");

	const onSubmit = useCallback(
		(field: string) => (d: EditMyProfileForm) => {
			const oldUser = { ...user };
			const newUser = d;
			setUser(newUser);

			if (field === "description" || field === "name") {
				if (oldUser.name != newUser.name || oldUser.description !== newUser.description)
					addToast({
						timerInMs: 3000,
						title: t("edit-profile.field-updated-toast", { field }),
						buttonText: "Undo",
						onClick: () => {
							setUser(oldUser);
							form.reset(oldUser);
						},
					});
			}
		},
		[setUser, user]
	);

	useEffect(() => {
		form.reset(user);
	}, [isLoaded]);

	return (
		<FormProvider {...form}>
			<form className="max-mobile:flex-col max-mobile:items-center flex items-start gap-3">
				<EditAvatar onSubmit={onSubmit("avatar")} />
				<div className="flex flex-1 flex-col gap-3">
					<Input
						{...form.register("name", {
							required: { message: "", value: true },
							onBlur: (e) => form.handleSubmit(onSubmit("name"))(e),
						})}
						error={!!form.formState.errors.name}
					/>
					<Input
						placeholder={t("edit-profile.description-placeholder")}
						textArea={{ rows: 5 }}
						maxLength={USER_DESCRIPTION_MAX_LENGTH}
						showMaxLengthCounter={isDescriptionFocused}
						value={description || ""}
						onFocus={toggleDescriptionFocused}
						{...form.register("description", {
							onBlur: (e) => {
								toggleDescriptionFocused();
								form.handleSubmit(onSubmit("description"))(e);
							},
							maxLength: {
								message: t("forms.errors.max", { field: "Description" }),
								value: USER_DESCRIPTION_MAX_LENGTH,
							},
						})}
					/>
					<EditSocialLinks onSubmit={onSubmit("links")} />
				</div>
			</form>
		</FormProvider>
	);
};
