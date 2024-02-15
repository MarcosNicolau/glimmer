import { Rabbit } from "../services";

export const loadRabbit = async () => {
	try {
		await Rabbit.connect();
		Rabbit.setupConsumers();
		console.log("rabbit connected");
	} catch (err) {
		console.error("could not connect with rabbit", err);
		return Promise.reject(err);
	}
};
