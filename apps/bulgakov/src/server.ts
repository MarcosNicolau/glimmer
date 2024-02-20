import { v1Router } from "./api/rest/v1/routes";
import { ENV_VARS } from "./config/env";
import { loadRedis, loadRabbit } from "./loaders";
import { wsBehaviour } from "./api/socket";
import { App } from "./utils/uws";

const startServer = async () => {
	try {
		const app = App({});
		await loadRedis();
		await loadRabbit(app);
		// Set up server
		app.ws("/*", wsBehaviour);
		v1Router("/v1", app);
		const port = ENV_VARS.PORT || 8000;
		app.listen(port, (listening) => {
			listening && console.log(`listening on port ${port}`);
		});
	} catch (err) {
		console.error("could not start server", err);
		process.exit(1);
	}
};

startServer();
