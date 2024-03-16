import { GetRooms } from "@glimmer/bulgakov";
import { Card, ViewersCount } from "@glimmer/ui/web";
import { useRouter } from "../../../libs/navigation";
import { ROUTES } from "apps/dostoevsky/src/libs/constants";
import { Speaker } from "apps/dostoevsky/src/modules/HomePage/Feed/Speaker";
import { Tag } from "apps/dostoevsky/src/modules/HomePage/Feed/Tag";

type Props = GetRooms["rooms"][0];

export const Room: React.FC<Props> = ({ id, name, description, numOfPeers, tags, speakers }) => {
	const router = useRouter();

	const goToRoom = () => router.push(ROUTES.ROOM(id));

	return (
		<Card className="px-8 py-6 transition">
			<div className="mb-5 flex flex-col">
				<h5 className="mb-2 cursor-pointer hover:underline" onClick={goToRoom}>
					{name}
				</h5>
				<p className="small">{description}</p>
			</div>
			<div className="only-small-mobile:flex-col flex flex-1 flex-wrap items-center justify-between gap-4 ">
				<div className="flex flex-1 flex-wrap gap-3">
					{tags.map((tag, idx) => (
						<Tag key={idx} tag={tag} />
					))}
				</div>
				<div className="only-small-mobile:flex-1 flex items-center justify-end gap-4">
					<div className="relative flex items-stretch">
						{speakers.map((speaker, idx) => (
							<Speaker
								key={speaker.id}
								idx={idx}
								speakersLength={speakers.length}
								{...speaker}
							/>
						))}
					</div>
					<ViewersCount number={numOfPeers} />
				</div>
			</div>
		</Card>
	);
};
