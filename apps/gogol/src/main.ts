import { mediasoupConfig } from "./config/mediasoup";
import { createWorkers, startRabbit } from "./loaders";
import { Room } from "@glimmer/gogol";
import { handlers } from "./handlers";
import { ENV_VARS } from "apps/gogol/src/config/env";
import { generateRandomString } from "@glimmer/utils";

export const main = async () => {
	const serverId = ENV_VARS.SERVER_ID || generateRandomString(6);
	const rooms: Record<string, Room> = {};
	const workers = await createWorkers(mediasoupConfig.numWorkers);

	try {
		await startRabbit(handlers(rooms, workers, serverId), serverId);
		console.log("Rabbit started");
	} catch (err) {
		console.error("err while starting rabbit", err);
		process.exit(1);
	}
};

main();
