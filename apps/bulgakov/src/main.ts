import { v1Router } from "./api/rest/v1/routes";
import { ENV_VARS } from "./config/env";
import { loadDB, loadRabbit } from "./loaders";
import { wsBehaviour } from "./api/socket";
import { App } from "./utils/uws";
import { isProduction } from "apps/bulgakov/src/utils/isProd";

const startServer = async () => {
	try {
		const app = App(
			// in production we don't handle ssl from the node app itself
			isProduction()
				? {}
				: // this necessary for the webrtc stuff
					{
						cert_file_name: ENV_VARS.LOCAL_SSL_CERT_FILE_NAME,
						key_file_name: ENV_VARS.LOCAL_SSL_KEY_FILE_NAME,
						passphrase: "",
					}
		);
		await loadDB();
		await loadRabbit(app);
		// Set up server
		app.ws("/*", wsBehaviour(app));
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
