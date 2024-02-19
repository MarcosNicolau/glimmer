import { createWorker } from "mediasoup";
import { mediasoupConfig } from "../config/mediasoup";
import { MyWorker } from "../types/mediasoup";

export const createWorkers = async (numWorkers: number): Promise<MyWorker[]> => {
	const workers: MyWorker[] = [];
	for (let i = 0; i < numWorkers; i++) {
		try {
			const worker: MyWorker = await createWorker({
				...mediasoupConfig.worker,
				appData: { id: i.toString() },
			});

			worker.on("died", () => {
				console.error(
					{ workerId: worker.pid },
					"mediasoup Worker died, exiting  in 2 seconds... [pid:%d]",
					worker.pid
				);

				setTimeout(() => process.exit(1), 2000);
			});
		} catch (err) {
			console.error(err);
			throw err;
		}
	}

	return workers;
};

/**
 * Destroys and empties the mediasoup worker array
 */
export const releaseWorkers = (workers: MyWorker[]) => {
	workers.forEach((worker) => worker.close());
	workers = [];
};
