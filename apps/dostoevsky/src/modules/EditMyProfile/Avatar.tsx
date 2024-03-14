import { Select } from "@glimmer/ui/web";
import { NUM_AVATAR_IMGS } from "apps/dostoevsky/src/libs/constants";
import { EditMyProfileForm, OnSubmitProp } from "apps/dostoevsky/src/modules/EditMyProfile/types";
import { useUserStore } from "apps/dostoevsky/src/state";
import Image from "next/image";
import { useFormContext } from "react-hook-form";

export const EditAvatar: React.FC<OnSubmitProp> = ({ onSubmit }) => {
	const { image, isLoaded } = useUserStore((state) => state);
	const { setValue, handleSubmit } = useFormContext<EditMyProfileForm>();

	const changeImage = (img: string) => {
		if (!isLoaded) return;
		setValue("image", img);
		handleSubmit(onSubmit)();
	};

	return (
		<div>
			<Select
				options={Array.from({ length: NUM_AVATAR_IMGS + 1 }).map((_, idx) => ({
					image: (
						<Image
							src={`/avatars/${idx}.jpg`}
							alt="myImage"
							className="max-w-none cursor-pointer rounded-full"
							height={50}
							width={50}
						/>
					),
					isSelected: image === `/avatars/${idx}.jpg`,
					value: `/avatars/${idx}.jpg`,
					selectedClassName: "bg-contrast-300",
				}))}
				selectedRender={() => (
					<Image
						src={image}
						alt="myImage"
						className="cursor-pointer rounded-full transition hover:opacity-[0.85]"
						height={50}
						width={50}
					/>
				)}
				onChange={changeImage}
				optionsParentClassName="max-h-[220px] w-[300px]"
				variant="no-fill"
				horizontal
			/>
		</div>
	);
};
