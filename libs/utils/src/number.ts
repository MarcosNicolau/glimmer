export const getRandomIntBetween = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1) + min);

export const generateRandomString = (length = 6) =>
	Math.random()
		.toString(20)
		.substring(2, length + 2);
