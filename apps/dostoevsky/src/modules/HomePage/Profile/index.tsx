"use client";
import { EditMyProfile } from "apps/dostoevsky/src/modules/EditMyProfile";
import { useTranslations } from "next-intl";

export const Profile = () => {
	const t = useTranslations();

	return (
		<div>
			<h4 className="mb-6">{t("edit-profile.header")}</h4>
			<EditMyProfile />
		</div>
	);
};
