import { HttpNext, HttpResponse } from "uWebSockets.js";

export type CorsMiddlewareConfig = {
	origin: string;
	allowMethods: string;
	allowHeaders: string;
	maxAge: string;
};

export const cors = (
	res: HttpResponse,
	next: HttpNext,
	{ origin, allowMethods, allowHeaders, maxAge }: CorsMiddlewareConfig
) => {
	res.writeHeader("Access-Control-Allow-Origin", origin);
	res.writeHeader("Access-Control-Allow-Methods", allowMethods);
	res.writeHeader("Access-Control-Allow-Headers", allowHeaders);
	res.writeHeader("Access-Control-Max-Age", maxAge);
	next();
};
