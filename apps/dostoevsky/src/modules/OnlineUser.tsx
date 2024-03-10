"use client";

import { GetOnlineUsers } from "@glimmer/bulgakov";
import { FilledCircleIcon } from "@glimmer/ui/web/components";
import Image from "next/image";

type Props = GetOnlineUsers["users"][0];

export const OnlineUser: React.FC<Props> = ({ name, image, room }) => {
	return (
		<div className="flex justify-between">
			<div className="w-[85%] flex gap-4 items-center justify-center">
				<Image
					className="cursor-pointer rounded-[100%]"
					src={image}
					alt="profile image"
					height={42}
					width={42}
				/>
				<div className="w-[70%] flex-1">
					<p className="text-text-100 cursor-pointer ">{name}</p>
					<p className="small cursor-pointer hover:underline whitespace-nowrap overflow-hidden text-ellipsis">
						{room?.name}
					</p>
				</div>
			</div>
			<div className="flex gap-2 justify-center items-end">
				<p className="small text-text-100 font-bold">{room?.connectedUsers}</p>
				<FilledCircleIcon className="fill-red h-[21px] w-[12px]" />
			</div>
		</div>
	);
};
