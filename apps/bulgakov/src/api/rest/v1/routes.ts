import { Router } from "@glimmer/http";
import { getToken } from "./controllers";
import { TemplatedApp } from "uWebSockets.js";

export const v1Router = (pattern: string, app: TemplatedApp) => {
	const authRouter = Router(`${pattern}/auth`, app);

	authRouter.get("/token", getToken);
};
