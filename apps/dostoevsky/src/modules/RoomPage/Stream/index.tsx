import { Card } from "@glimmer/ui/web";
import { StreamCollapsibleHeader } from "apps/dostoevsky/src/modules/RoomPage/Stream/Header";
import { Peers } from "apps/dostoevsky/src/modules/RoomPage/Stream/Peers";
import { useRoomStore } from "apps/dostoevsky/src/state";

export const Stream = () => {
	const { room } = useRoomStore();

	return (
		<Card className="h-full !px-0 !pt-0">
			<StreamCollapsibleHeader>
				<div className="flex flex-col gap-6">
					<Peers
						peers={room?.peers.filter((peer) => !peer.isSpeaker) || []}
						title="Speakers"
					/>
					<Peers
						peers={room?.peers.filter((peer) => !peer.askedToSpeak) || []}
						title="Request to speak"
					/>
					<Peers
						peers={
							room?.peers.filter((peer) => peer.isSpeaker || peer.askedToSpeak) || []
						}
						title="Listeners"
					/>
				</div>
			</StreamCollapsibleHeader>
		</Card>
	);
};
