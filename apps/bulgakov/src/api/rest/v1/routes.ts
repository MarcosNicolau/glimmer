import { Router } from "@glimmer/http";
import {
	getOnlineUsers,
	getOnlineUsersCount,
	getRoom,
	getRooms,
	getToken,
	getUser,
} from "./controllers";
import { TemplatedApp } from "uWebSockets.js";
import { defaultCors } from "../middlewares/cors";

export const v1Router = (pattern: string, app: TemplatedApp) => {
	const authRouter = Router(`${pattern}/auth`, app);
	const userRouter = Router(`${pattern}/users`, app);
	const roomRouter = Router(`${pattern}/rooms`, app);

	authRouter.post("/token", defaultCors({ end: false }), getToken);
	authRouter.options("/token", defaultCors({ end: true }));

	userRouter.get("/:id", defaultCors({ end: false }), getUser);
	userRouter.options("/:id", defaultCors({ end: true }));

	userRouter.get("/online", defaultCors({ end: false }), getOnlineUsers);
	userRouter.options("/online", defaultCors({ end: true }));

	userRouter.get("/online/count", defaultCors({ end: false }), getOnlineUsersCount);
	userRouter.options("/online/count", defaultCors({ end: true }));

	roomRouter.get("/", defaultCors({ end: false }), getRooms);
	roomRouter.options("/", defaultCors({ end: true }));
	roomRouter.get("/:id", defaultCors({ end: false }), getRoom);
	roomRouter.options("/:id", defaultCors({ end: true }));
};
