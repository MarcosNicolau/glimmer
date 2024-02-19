import { getReasonPhrase } from "http-status-codes";
import {
	AppOptions,
	HttpHandler,
	HttpRequest,
	HttpResponse,
	RecognizedString,
	TemplatedApp,
	App as _App,
} from "uWebSockets.js";

// We are wrapping the handlers following express like api
const runHandlers = async (res: HttpResponse, req: HttpRequest, ...handlers: HttpHandler[]) => {
	/**
	 * In uWebsockets, request must be ended, otherwise the server will hangup forever until the client closes it.
	 * But if the client has closed it and we tried to end the req then we are in big problems!!
	 */
	let aborted = false;
	// Luckily for us, this method fires when the client closes the req
	res.onAborted(() => {
		aborted = true;
	});
	// With that in mind, we just redefined the end method so that is always safe :)
	const _end = res.end;
	res.end = (body) => {
		if (aborted) return res;
		else return _end(body);
	};

	res.send = ({ status, message, result = {} }) =>
		// Sure we are corking babe
		res.cork(() => {
			res.writeStatus(status.toString()).end(
				JSON.stringify({
					code: status,
					message: message || getReasonPhrase(status),
					result,
				})
			);
		});

	req.body = () =>
		new Promise((resolve) => {
			let buffer: Buffer;
			res.onData((chunk, isLast) => {
				const curBuf = Buffer.from(chunk);
				if (isLast)
					return buffer
						? resolve(JSON.parse(Buffer.concat([buffer, curBuf]).toString()))
						: resolve(JSON.parse(Buffer.concat([curBuf]).toString()));
				buffer = buffer ? Buffer.concat([buffer, curBuf]) : Buffer.concat([curBuf]);
			});
		});
	const headers: Record<string, string> = {};
	req.forEach((key, value) => {
		headers[key] = value;
	});
	req.headers = headers;

	try {
		for await (const handler of handlers) {
			let shouldRunNext = false;
			await handler(res, req, () => (shouldRunNext = true));
			if (!shouldRunNext) break;
		}
	} catch (err) {
		if (!aborted) res.writeStatus("500").end();
		console.error("A handler has not ended as expected", err);
	}
};

export const Router = (prefix: string | null, app: TemplatedApp) => {
	const handle =
		(method: "get" | "post" | "put" | "del") =>
		(route: RecognizedString, ...handlers: HttpHandler[]) =>
			app[method](prefix ? `${prefix}/${route}` : route, async (res, req) => {
				await runHandlers(res, req, ...handlers);
			});

	return {
		get: handle("get"),
		post: handle("post"),
		put: handle("put"),
		delete: handle("del"),
	};
};

const buildApp = (app: TemplatedApp): TemplatedApp => {
	const router = Router(null, app);

	app.get = router.get;
	app.post = router.post;
	app.put = router.put;
	app.del = router.delete;

	return app;
};

export const App = (options?: AppOptions): TemplatedApp => buildApp(_App(options));
