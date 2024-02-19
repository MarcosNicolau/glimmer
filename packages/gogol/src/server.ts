import { mediasoupConfig } from "./config/mediasoup";
import { createWorkers, startRabbit } from "./loaders";
import { Room } from "./types/room";
import { handlers } from "./opHandlers";

export const main = async () => {
	const rooms: Record<string, Room> = {};

	const workers = await createWorkers(mediasoupConfig.numWorkers);

	try {
		await startRabbit(handlers(rooms, workers));
		console.log("Rabbit started");
	} catch (err) {
		console.error("err while starting rabbit", err);
		process.exit(1);
	}
};

main();
