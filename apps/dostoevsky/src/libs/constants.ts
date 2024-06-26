export const LOCAL_STORAGE_KEYS = {
	TOKEN: "token",
	USER: "user",
	USER_ID: "user-id",
} as const;

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
export const NUM_AVATAR_IMGS = 20;

export const ROUTES = {
	HOME: "/",
	ROOM: (id: string): `/room/${typeof id}` => `/room/${id}`,
} as const;

export const LINKS = {
	GITHUB: "https://github.com/MarcosNicolau/glimmer",
};
