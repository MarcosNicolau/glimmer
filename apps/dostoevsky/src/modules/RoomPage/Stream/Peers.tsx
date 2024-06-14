import { OutgoingActionsPayload } from "@glimmer/bulgakov";
import { Peer } from "apps/dostoevsky/src/modules/RoomPage/Stream/Peer";

type Props = {
	title: string;
	peers: OutgoingActionsPayload["@room:state"]["room"]["peers"];
};

export const Peers: React.FC<Props> = ({ title, peers }) => (
	<div>
		<div className="mb-6 flex items-center gap-5">
			<h5>{title}</h5>
			<p className="bg-contrast-300 text-text-100 small rounded px-1">{peers.length}</p>
		</div>
		<div className="flex items-center gap-4">
			{peers.map((peer) => (
				<Peer key={peer.user.id} {...peer} />
			))}
		</div>
	</div>
);
