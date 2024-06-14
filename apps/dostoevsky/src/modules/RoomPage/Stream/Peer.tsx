import { OutgoingActionsPayload } from "@glimmer/bulgakov";
import Image from "next/image";

type Props = OutgoingActionsPayload["@room:state"]["room"]["peers"][0];

export const Peer: React.FC<Props> = ({ user }) => {
	return (
		<div className="flex flex-col items-center justify-center gap-1">
			<Image height={50} width={50} src={user.image || ""} alt="" className="rounded-full" />
			<p className="small text-text-100 max-w-[75px] text-center">{user.name}</p>
		</div>
	);
};
