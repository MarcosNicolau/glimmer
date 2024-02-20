import * as uws from "uWebSockets.js";

declare module "uWebSockets.js" {
	export interface HttpRequest extends uws.HttpRequest {
		/**
		 * @returns parsed body
		 */
		body: <Body extends object = object>() => Promise<Body>;
		headers: Record<string, string>;
	}

	export interface HttpResponse extends uws.HttpResponse {
		/**
		 * Use this method to safely end the response
		 */
		send: ({}: { status: string | number; message?: string; result?: object }) => void;
	}

	export type HttpHandler = (
		res: HttpResponse,
		req: HttpRequest,
		next: () => void
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
