import { getRandomIntBetween, generateRandomString } from "./number";

describe("number", () => {
	it("getRandomNumberBetween", () => {
		const result = getRandomIntBetween(1, 2);
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(2);
	});

	it("getRandomCode", () => {
		const result = generateRandomString(10);
		expect(result).toHaveLength(10);
	});
});
