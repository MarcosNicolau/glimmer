import { GetRooms } from "@glimmer/bulgakov";
import { useModal } from "@glimmer/hooks";
import { UserProfile } from "apps/dostoevsky/src/modules/UserProfile";
import Image from "next/image";

type Props = GetRooms["rooms"][0]["speakers"][0] & { idx: number; speakersLength: number };

export const Speaker: React.FC<Props> = ({ id, idx, speakersLength, image }) => {
	const { open, setOpen, toggleOpen } = useModal();
	return (
		<div
			style={{ translate: `${(speakersLength - idx - 1) * 12}px 0` }}
			className="cursor-pointer transition  hover:-translate-y-2"
		>
			{open && <UserProfile open={open} setOpen={setOpen} id={id} />}
			<Image
				src={image}
				alt=""
				height={30}
				width={30}
				className="max-w-none rounded-full"
				onClick={toggleOpen}
			/>
		</div>
	);
};
