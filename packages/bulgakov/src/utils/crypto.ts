import * as crypto from "node:crypto";

// Wrapping it in a promise to dispatch it to another thread(libuv thread pool) and not block the event loop.
/**
 * @param length be cautious about this number
 */
export const generateRandomCode = (length = 6) =>
	new Promise<string>((resolve) => resolve(crypto.randomBytes(length).toString()));

// I believe this is the most efficient and the least blocking, form of generating the UUID.
// We should not be concerned about blocking the event loop too much.
export const generateRandomId = () => crypto.randomUUID();
