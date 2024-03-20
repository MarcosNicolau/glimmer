export const select = {
	peers: {
		joinRoom: {
			askedToSpeak: true,
			isDeafened: true,
			isMuted: true,
			isSpeaker: true,
			role: true,
			user: {
				select: {
					id: true,
					name: true,
					image: true,
				},
			},
		},
		voiceServerId: {
			room: {
				select: {
					id: true,
					voiceServerId: true,
				},
			},
		},
	},
};
