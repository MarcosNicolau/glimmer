import uws from "uWebSockets.js";
import { socketBehav } from "./socket";

const startServer = () => {
	const app = uws.App();
	const ws = app.ws("/*", socketBehav);

	ws.listen(8000, (listening) => {
		listening && console.log("listening on port 8000");
	});
};

startServer();
