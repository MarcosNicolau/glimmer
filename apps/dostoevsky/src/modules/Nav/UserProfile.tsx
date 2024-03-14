import { useOnClickOutside, useOnKeyDown, useToggle } from "@glimmer/hooks";
import { Card } from "@glimmer/ui/web/components";
import { EditMyProfile } from "apps/dostoevsky/src/modules/EditMyProfile";
import { useUserStore } from "apps/dostoevsky/src/state";
import Image from "next/image";

export const UserProfile = () => {
	const { image } = useUserStore();
	const [open, toggle, setOpen] = useToggle();
	const [ref] = useOnClickOutside<HTMLDivElement>(() => {
		setOpen(false);
	});
	useOnKeyDown(({ key }) => key === "Escape" && setOpen(false));

	return (
		<div className="relative flex justify-center gap-1" ref={ref}>
			<Image
				src={image}
				alt="profile"
				height={35}
				width={35}
				className="cursor-pointer rounded-full hover:opacity-[0.85]"
				onClick={toggle}
			/>
			{open && (
				<div
					className="only-mobile:min-w-[320px] only-small-mobile:min-w-[100vw] only-small-mobile:justify-center only-small-mobile:right-[-40px] absolute right-0
				 top-[45px] flex min-w-[450px] justify-end "
				>
					<Card className="only-mobile:max-h-[400px] z-20 max-h-[500px] w-[95%] overflow-auto shadow">
						<EditMyProfile />
					</Card>
				</div>
			)}
		</div>
	);
};
