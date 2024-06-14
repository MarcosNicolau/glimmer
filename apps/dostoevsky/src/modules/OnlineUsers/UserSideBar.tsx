import { GetOnlineUsers } from "@glimmer/bulgakov";
import { useModal } from "@glimmer/hooks";
import { FilledCircleIcon } from "@glimmer/ui/web";
import { ROUTES } from "apps/dostoevsky/src/libs/constants";
import { useRouter } from "apps/dostoevsky/src/libs/navigation";
import { UserProfile } from "apps/dostoevsky/src/modules/UserProfile";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

type Props = GetOnlineUsers["users"][0];

export const UserSideBar: React.FC<Props> = ({ image, name, room, id }) => {
	const [isHovering, setIsHovering] = useState(false);
	const { setOpen, toggleOpen, open } = useModal(false);
	const router = useRouter();

	const goToRoom = () => router.push(ROUTES.ROOM(room?.id || ""));

	return (
		<>
			{open && <UserProfile id={id} open={open} setOpen={setOpen} />}
			<div className="flex items-center gap-1" onMouseLeave={() => setIsHovering(false)}>
				<Image
					className={clsx("cursor-pointer rounded-[100%] transition", {
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
					<div className="bg-contrast-100 border-contrast-300 absolute left-[110px] z-20 flex gap-4 rounded border p-3">
						<div className="flex max-w-[200px] flex-col gap-1">
							<p
								onClick={toggleOpen}
								className="text-text-100 cursor-pointer text-ellipsis whitespace-nowrap"
							>
								{name}
							</p>
							{room && (
								<p
									onClick={goToRoom}
									className="small cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
								>
									{room?.name}
								</p>
							)}
						</div>

						{room && (
							<div className="flex items-end justify-center gap-1">
								<p className="small text-text-100 font-bold">
									{room?.connectedUsers}
								</p>
								<FilledCircleIcon className="fill-red h-[21px] w-[12px]" />
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
};
