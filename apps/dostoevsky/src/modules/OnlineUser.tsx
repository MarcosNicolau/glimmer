"use client";

import { GetOnlineUsers } from "@glimmer/bulgakov";
import { useModal } from "@glimmer/hooks";
import { FilledCircleIcon } from "@glimmer/ui/web/components";
import { UserProfile } from "apps/dostoevsky/src/modules/UserProfile";
import Image from "next/image";
import { MouseEventHandler } from "react";

type Props = GetOnlineUsers["users"][0];

export const OnlineUser: React.FC<Props> = ({ name, image, id, room }) => {
	const { open, setOpen, toggleOpen } = useModal(false);

	const onClick: MouseEventHandler<HTMLElement> = (e) => {
		e.stopPropagation();
		toggleOpen();
	};

	return (
		<>
			{open && <UserProfile open={open} setOpen={setOpen} id={id} />}
			<div className="flex justify-between">
				<div className="w-[85%] flex gap-4 items-center justify-center">
					<Image
						className="cursor-pointer rounded-[100%]"
						src={image || ""}
						alt="profile image"
						height={42}
						width={42}
						onClick={onClick}
					/>
					<div className="w-[70%] flex-1">
						<p className="text-text-100 cursor-pointer " onClick={onClick}>
							{name}
						</p>
						{room && (
							<p className="small cursor-pointer hover:underline whitespace-nowrap overflow-hidden text-ellipsis">
								{room.name}
							</p>
						)}
					</div>
				</div>

				{room && (
					<div className="flex gap-2 justify-center items-end">
						<p className="small text-text-100 font-bold">{room?.connectedUsers}</p>
						<FilledCircleIcon className="fill-red h-[21px] w-[12px]" />
					</div>
				)}
			</div>
		</>
	);
};
