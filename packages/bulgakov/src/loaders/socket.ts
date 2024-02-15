import { ws } from "../api/socket";

export const loadSocket = () => {
	ws.listen(8000, (listening) => {
		listening && console.log("listening on port 8000");
	});
};
