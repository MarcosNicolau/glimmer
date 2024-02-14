import { mediasoupConfig } from "./config/mediasoup";
import { createWorkers, startRabbit } from "./loaders";
import { Room } from "./types/room";
import { handlers } from "./opHandlers";

export const main = async () => {
    const rooms: Record<string, Room> = {};

    const workers = await createWorkers(mediasoupConfig.numWorkers);

    await startRabbit(handlers(rooms, workers));
};

main();
