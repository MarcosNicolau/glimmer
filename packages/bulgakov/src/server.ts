import { ENV_VARS } from "./config/env";
import { buildWsUtils } from "./api/socket/index";
import { App } from "uWebSockets.js";
import { loadRedis, loadRabbit } from "./loaders";
import { wsBehaviour } from "./api/socket";

const startServer = async () => {
	try {
		const app = App();
		const ws = buildWsUtils(app.ws("/*", wsBehaviour));
		await loadRedis();
		await loadRabbit(ws);
		const port = ENV_VARS.PORT || 8000;
		ws.listen(port, (listening) => {
			listening && console.log(`listening on port ${port}`);
		});
	} catch (err) {
		console.error("could not start server", err);
		process.exit(1);
	}
};

startServer();
