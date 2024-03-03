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
	res._end = res.end;
	res.end = (body) => {
		if (aborted) return res;
		else return res.cork(() => res._end(body));
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
				try {
					const curBuf = Buffer.from(chunk);
					if (isLast)
						return buffer
							? resolve(JSON.parse(Buffer.concat([buffer, curBuf]).toString()))
							: resolve(JSON.parse(Buffer.concat([curBuf]).toString()));
					buffer = buffer ? Buffer.concat([buffer, curBuf]) : Buffer.concat([curBuf]);
				} catch (err) {
					if (!aborted) res.send({ status: 500 });
					console.error("Could not read body, are you sure this is a post request?", err);
				}
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
			const next = () => (shouldRunNext = true);
			await handler(res, req, next);
			if (!shouldRunNext) break;
		}
	} catch (err) {
		if (!aborted) res.writeStatus("500").end();
		console.error("A handler has not ended as expected", err);
	}
};

export const Router = (prefix: string | null, app: TemplatedApp) => {
	/**
	 * This seems pretty weird, I know. Let me explain you,
	 * In theory, once a function has been defined, it is not possible to mutate it.
	 * However, as most cases, there is a dirty workaround...
	 * The only way for a variable which references a function to reference a different function would be to assign it to a new property inside an object.
	 * For example:
	 * 	if we have const foo = (...args) => {...}, to not loose the function when reassigning it, we do:
	 * 	const holder = { a: foo } And then,
	 * 	holder.b = holder.a. Finally we can just do,
	 *  holder.a = () => {...} //Our new function.
	 * 	This way, we can keep the original function that a was holding, which is what are doing below.
	 */

	if (!app._get) app._get = app.get;

	if (!app._post) app._post = app.post;

	if (!app._put) app._put = app.put;

	if (!app._del) app._del = app.del;

	if (!app._options) app._options = app.options;

	const handle =
		(method: "get" | "post" | "put" | "del" | "options") =>
		(route: RecognizedString, ...handlers: HttpHandler[]) =>
			//@ts-expect-error idk
			app[`_${method}`](prefix ? prefix + route : route, async (res, req) => {
				await runHandlers(res, req, ...handlers);
			});

	return {
		get: handle("get"),
		post: handle("post"),
		put: handle("put"),
		del: handle("del"),
		options: handle("options"),
	};
};

const buildApp = (app: TemplatedApp): TemplatedApp => {
	const router = Router(null, app);

	app.get = router.get;
	app.post = router.post;
	app.put = router.put;
	app.del = router.del;
	app.options = router.options;

	return app;
};

export const App = (options?: AppOptions): TemplatedApp => buildApp(_App(options));
