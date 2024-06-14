export const SOCKET_TOPICS = {
	ROOM: (id: string) => `room/${id}`,
	USER: (userId: string) => `user/${userId}`,
};
