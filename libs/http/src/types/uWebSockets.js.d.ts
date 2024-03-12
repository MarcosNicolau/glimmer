import { WithOptional } from "@glimmer/types";
import { APIResponse } from "./index";
import * as uws from "uWebSockets.js";

declare module "uWebSockets.js" {
	export interface HttpRequest extends uws.HttpRequest {
		/**
		 * @returns parsed body
		 */
		body: <Body extends object = object>() => Promise<Body>;
		headers: Record<string, string>;
		params: any;
	}

	export interface HttpResponse extends uws.HttpResponse {
		/**
		 * Use this method to safely end the response
		 */
		send: <T extends object>({}: WithOptional<APIResponse<T>, "message" | "result">) => void;
	}

	export type HttpNext = () => void;

	export type HttpHandler = (
		res: HttpResponse,
		req: HttpRequest,
		next: HttpNext
	) => void | Promise<void>;

	export interface TemplatedApp extends uws.TemplatedApp {
		get(pattern: RecognizedString, ...handler: HttpHandler[]): TemplatedApp;
		post(pattern: RecognizedString, ...handler: HttpHandler[]): TemplatedApp;
		put(pattern: RecognizedString, ...handler: HttpHandler[]): TemplatedApp;
		del(pattern: RecognizedString, ...handler: HttpHandler[]): TemplatedApp;
		[key: string]: any;
	}
}

export {};
