import { prisma } from "./config/prisma";
import { Users } from "./services";
import { Prisma } from "@prisma/client";

const data: { users: Prisma.UserCreateArgs["data"][]; rooms: Prisma.RoomCreateArgs["data"][] } = {
	users: [
		{
			id: "1",
			name: "Marcos",
			description: "Hello there my name is marcos",
			image: "",
			peer: {
				create: {
					askedToSpeak: false,
					isDeafened: false,
					isMuted: false,
					isSpeaker: false,
					role: "creator",
					roomId: "1",
				},
			},
		},
		{
			id: "2",
			name: "Jhon",
			description: "Hello there my name is jhon",
			image: "",
			peer: {
				create: {
					askedToSpeak: false,
					isDeafened: false,
					isMuted: false,
					isSpeaker: false,
					role: "member",
					roomId: "1",
				},
			},
		},
		{
			id: "3",
			name: "Manuel",
			description: "Hello there my name is manuel",
			image: "",
			peer: {
				create: {
					askedToSpeak: false,
					isDeafened: false,
					isMuted: false,
					isSpeaker: false,
					role: "creator",
					roomId: "2",
				},
			},
		},
	],
	rooms: [
		{
			id: "1",
			name: "My room 1",
			description: "My room broo",
			isPrivate: false,
			tags: [],
			ownerId: "1",
		},
		{
			id: "2",
			name: "My room 2",
			description: "My room broo",
			isPrivate: false,
			tags: [],
			ownerId: "1",
		},
	],
};

export const mockData = async () => {
	const { users, rooms } = data;

	// for await (const room of rooms) {
	// 	await prisma.room.create({ data: room });
	// }
	for await (const user of users) {
		await Users.create({
			...user,
		});
	}
};
