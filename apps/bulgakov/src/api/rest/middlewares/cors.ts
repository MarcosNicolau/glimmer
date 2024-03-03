import { cors } from "@glimmer/http";
import { IS_PROD, DOMAIN } from "../../../constants";
import { HttpHandler } from "uWebSockets.js";

export const defaultCors: HttpHandler = (res, req, next) => {
	cors(res, next, {
		origin: IS_PROD ? DOMAIN : "*",
		allowMethods: "GET, POST, HEAD",
		allowHeaders: "Accept, Accept-Language, Content-Language, Content-Type, Authorization",
		maxAge: "3600",
	});
};
