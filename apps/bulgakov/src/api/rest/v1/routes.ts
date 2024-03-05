import { Router } from "@glimmer/http";
import { getToken, getUser } from "./controllers";
import { TemplatedApp } from "uWebSockets.js";
import { defaultCors } from "../middlewares/cors";

export const v1Router = (pattern: string, app: TemplatedApp) => {
	const authRouter = Router(`${pattern}/auth`, app);
	const userRouter = Router(`${pattern}/user`, app);

	authRouter.post("/token", defaultCors, getToken);
	authRouter.options("/token", defaultCors, (res) => res.send({ status: 200 }));

	userRouter.get("/:id", defaultCors, getUser);
	userRouter.options("/:id", defaultCors, (res) => res.send({ status: 200 }));
};
