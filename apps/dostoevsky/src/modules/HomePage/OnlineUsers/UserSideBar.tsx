import { GetOnlineUsers } from "@glimmer/bulgakov";
import { useModal } from "@glimmer/hooks";
import { FilledCircleIcon } from "@glimmer/ui/web/components";
import { UserProfile } from "apps/dostoevsky/src/modules/UserProfile";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

type Props = GetOnlineUsers["users"][0];

export const UserSideBar: React.FC<Props> = ({ image, name, room, id }) => {
	const [isHovering, setIsHovering] = useState(false);
	const { setOpen, toggleOpen, open } = useModal(false);

	return (
		<>
			<UserProfile id={id} open={open} setOpen={setOpen} />
			<div
				className="flex gap-1 items-center relative"
				onMouseLeave={() => setIsHovering(false)}
			>
				<Image
					className={clsx("transition cursor-pointer rounded-[100%]", {
						"translate-x-1": isHovering,
					})}
					src={image}
					alt="profile image"
					height={50}
					width={50}
					onClick={toggleOpen}
					onMouseEnter={() => setIsHovering(true)}
				/>
				{isHovering && (
					<div className="absolute bg-contrast-100 left-[65px] gap-2 shadow p-3 rounded z-20 flex">
						<div className="max-w-[200px]">
							<p
								onClick={toggleOpen}
								className="text-text-100 whitespace-nowrap mb-1 text-ellipsis cursor-pointer"
							>
								{name}
							</p>
							<p className="small whitespace-nowrap text-ellipsis  overflow-hidden hover:underline cursor-pointer">
								{room?.name}
							</p>
						</div>
						<div className="flex gap-1 justify-center items-end">
							<p className="small text-text-100 font-bold">{room?.connectedUsers}</p>
							<FilledCircleIcon className="fill-red h-[21px] w-[12px]" />
						</div>
					</div>
				)}
			</div>
		</>
	);
};
