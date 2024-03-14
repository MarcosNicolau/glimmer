import { useToggle } from "@glimmer/hooks";
import {
	Button,
	CrossIcon,
	Input,
	SocialLink,
	SocialMediaIcon,
	getSocialMediaFromLink,
} from "@glimmer/ui/web";
import { EditMyProfileForm, OnSubmitProp } from "apps/dostoevsky/src/modules/EditMyProfile/types";
import { useUserStore } from "apps/dostoevsky/src/state";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

export const EditSocialLinks: React.FC<OnSubmitProp> = ({ onSubmit }) => {
	const { links, isLoaded } = useUserStore();
	const [edit, toggleEdit] = useToggle(false);
	const { register, setValue, getValues, watch, handleSubmit } =
		useFormContext<EditMyProfileForm>();
	const linksForm = watch("links");
	const t = useTranslations();

	const insertNewSocialLink = () => {
		setValue(`links.${getValues("links").length}.url`, "");
	};

	const deleteSocialLink = (idx: number) => {
		const links = getValues("links");
		setValue(
			"links",
			links.filter((_, _idx) => _idx !== idx)
		);
	};

	const onConfirm = () => {
		handleSubmit(onSubmit)();
		toggleEdit();
	};

	const onCancel = () => {
		setValue("links", links);
		toggleEdit();
	};

	const onClick = () => {
		if (isLoaded && !links.length) insertNewSocialLink();
		toggleEdit();
	};

	return (
		<>
			{!edit ? (
				<div className="flex flex-wrap gap-2">
					{links.map((link, idx) => (
						<SocialLink key={idx} {...link} />
					))}

					<Button onClick={onClick} variant="text-underlined" className="text-left">
						{links.length ? t("forms.edit") : t("edit-profile.add-social-link")}
					</Button>
				</div>
			) : (
				<div className="flex flex-col gap-1">
					{linksForm.map((_, idx) => (
						<Input
							textArea={{ rows: 2 }}
							icon={(props) => (
								<SocialMediaIcon
									key={idx}
									media={getSocialMediaFromLink(linksForm[idx].url)}
									{...props}
									className="fill-accent-100"
								/>
							)}
							RightButton={
								<CrossIcon
									width={20}
									onClick={() => deleteSocialLink(idx)}
									className="cursor-pointer"
								/>
							}
							key={idx}
							{...register(`links.${idx}.url`, { required: true })}
						/>
					))}
				</div>
			)}
			{edit && (
				<Button variant="text" className="mb-4" onClick={insertNewSocialLink}>
					+ {t("edit-profile.add-social-link")}
				</Button>
			)}
			{edit && (
				<div className="flex items-center justify-between">
					<Button onClick={onConfirm} variant="text-underlined" className="text-left">
						{t("forms.confirm")}
					</Button>
					<Button onClick={onCancel} variant="text" className="font-medium">
						{t("forms.cancel")}
					</Button>
				</div>
			)}
		</>
	);
};
