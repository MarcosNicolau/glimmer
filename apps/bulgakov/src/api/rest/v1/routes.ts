import { Router } from "@glimmer/http";
import { getToken } from "./controllers";
import { TemplatedApp } from "uWebSockets.js";
import { defaultCors } from "../middlewares/cors";

export const v1Router = (pattern: string, app: TemplatedApp) => {
	const authRouter = Router(`${pattern}/auth`, app);

	authRouter.post("/token", defaultCors, getToken);
	authRouter.options("/token", defaultCors, (res) => res.send({ status: 200 }));
};
