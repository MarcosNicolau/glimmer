import { GetUser } from "@glimmer/bulgakov";
import { SocialMediaIcon } from "@glimmer/ui/web/components";
import { getSocialMediaFromLink } from "apps/dostoevsky/src/libs/socialMedia";

type Props = GetUser["links"][0];

export const SocialLink: React.FC<Props> = ({ url }) => {
	return (
		<SocialMediaIcon
			media={getSocialMediaFromLink(url)}
			className="cursor-pointer hover:fill-accent-100 fill-accent-200"
		/>
	);
};
