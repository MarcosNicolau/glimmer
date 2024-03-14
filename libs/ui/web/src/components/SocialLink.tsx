import { SocialMediaIcon, RecognizedSocialLinksIcon } from "./Icons";
import React from "react";

type Props = {
	url: string;
};

export const getSocialMediaFromLink = (url: string): RecognizedSocialLinksIcon => {
	const socialMediaDomains: { [key: string]: RecognizedSocialLinksIcon } = {
		"github.com": "github",
		"instagram.com": "instagram",
		"facebook.com": "facebook",
		"twitter.com": "x",
		"reddit.com": "reddit",
		"youtube.com": "youtube",
		"tiktok.com": "tiktok",
		"snapchat.com": "snapchat",
		"quora.com": "quora",
		"twitch.tv": "twitch",
		"linktr.ee": "linktree",
	};

	// Extract the domain from the URL
	const domainStartIndex = url.indexOf("//") + 2;
	const domainEndIndex = url.indexOf("/", domainStartIndex);
	const domain = url.substring(
		domainStartIndex,
		domainEndIndex !== -1 ? domainEndIndex : undefined
	);

	return socialMediaDomains[domain] || "";
};

export const SocialLink: React.FC<Props> = ({ url }) => (
	<a href={url} rel="noreferrer" target="_blank">
		<SocialMediaIcon
			media={getSocialMediaFromLink(url)}
			className="hover:fill-accent-100 fill-accent-200 cursor-pointer"
		/>
	</a>
);
