import { mediasoupConfig } from "../config/mediasoup";
import { MyWorker } from "../types/mediasoup";
import { Room } from "../types/room";

export const workerCapability = () => {};

export const shouldScaleRoom = () => {};

export const scaleRoom = () => {};

export const createRoom = async (id: string, worker: MyWorker): Promise<Room> => {
	const router = await worker.createRouter({ ...mediasoupConfig.router });

	console.log(`room created on worker ${worker.appData.id} and router ${router.id}`);

	return {
		worker,
		router,
		state: {
			id: id,
			peers: {},
		},
	};
};
