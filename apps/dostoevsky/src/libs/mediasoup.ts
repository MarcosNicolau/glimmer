import { WebRtcTransportConnData } from "@glimmer/gogol";
import { MyWebSocket } from "apps/dostoevsky/src/types/ws";
import { Device } from "mediasoup-client";

export const createRecvTransport = (
	conn: WebRtcTransportConnData,
	device: Device,
	socket: MyWebSocket
) => {
	const recvTransport = device.createRecvTransport(conn);
	// Connect transport to server
	recvTransport.on("connect", async ({ dtlsParameters }, cb, errBack) => {
		try {
			await socket.sendAndWaitForRes(
				{
					action: "@room:connect-webRtcTransport",
					payload: { direction: "recv", dtlsParameters },
				},
				"@room:recv-transport-connected"
			);
			cb();
		} catch (err: any) {
			errBack(err);
		}
	});
	return recvTransport;
};

// Create send transport and setups the listener for the connect and produce events
export const createSendTransport = (
	conn: WebRtcTransportConnData,
	device: Device,
	socket: MyWebSocket
) => {
	const sendTransport = device.createSendTransport(conn);
	sendTransport?.on("connect", async ({ dtlsParameters }, cb, errBack) => {
		try {
			await socket.sendAndWaitForRes(
				{
					action: "@room:connect-webRtcTransport",
					payload: { dtlsParameters, direction: "send" },
				},
				"@room:send-transport-connected"
			);
			cb();
		} catch (err: any) {
			errBack(err);
		}
	});
	sendTransport?.on("produce", async (params, cb, errBack) => {
		try {
			const res = await socket.sendAndWaitForRes(
				{
					action: "@room:send-track",
					payload: {
						produceParams: {
							...params,
							paused: false,
						},
					},
				},
				"@room:send-track-done"
			);
			cb({ id: res.producerId });
		} catch (err: any) {
			errBack(err);
		}
	});
	return sendTransport;
};
