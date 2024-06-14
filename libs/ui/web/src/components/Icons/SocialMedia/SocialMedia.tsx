import { LiteralUnion } from "@glimmer/types";
import {
	FacebookIcon,
	GithubIcon,
	InstagramIcon,
	XIcon,
	YouTubeIcon,
	TwitchIcon,
	LinktreeIcon,
	QuoraIcon,
	RedditIcon,
	SnapchatIcon,
	TikTokIcon,
	SvgProps,
} from "../index";
import { LinkIcon } from "../Link";

export type RecognizedSocialLinksIcon = LiteralUnion<
	| "github"
	| "instagram"
	| "facebook"
	| "x"
	| "reddit"
	| "youtube"
	| "tiktok"
	| "snapchat"
	| "quora"
	| "twitch"
	| "linktree"
>;

const getIcon = (media: RecognizedSocialLinksIcon, props: SvgProps = {}): React.ReactNode => {
	const recognized: { [key in RecognizedSocialLinksIcon]: React.ReactNode } = {
		github: <GithubIcon {...props} />,
		x: <XIcon {...props} />,
		instagram: <InstagramIcon {...props} />,
		facebook: <FacebookIcon {...props} />,
		youtube: <YouTubeIcon {...props} />,
		twitch: <TwitchIcon {...props} />,
		linktree: <LinktreeIcon {...props} />,
		quora: <QuoraIcon {...props} />,
		reddit: <RedditIcon {...props} />,
		snapchat: <SnapchatIcon {...props} />,
		tiktok: <TikTokIcon {...props} />,
	};

	if (recognized[media]) return recognized[media];
	return <LinkIcon {...props} />;
};

type Props = SvgProps & {
	media: RecognizedSocialLinksIcon;
};

export const SocialMediaIcon: React.FC<Props> = ({ media, ...props }) => getIcon(media, props);
