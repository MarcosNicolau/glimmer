"use client";
import { WS_URL } from "apps/dostoevsky/src/libs/constants";
import { getWebSocket } from "apps/dostoevsky/src/libs/ws";
import { useSocketStore, useTokenStore, useUserStore } from "apps/dostoevsky/src/state";
import { useEffect } from "react";

export const ConnectToWs: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { setSocket, setConnState, socket, connState } = useSocketStore((state) => state);
	const { setUser, isLoaded: userLoaded, ...user } = useUserStore();
	const token = useTokenStore((state) => state.token);

	useEffect(() => {
		if (connState === "idle" && userLoaded && token) {
			// Browser WebSocket implementation does not allows us to pass custom headers only the "Sec-WebSocket-Protocol"
			// So we just extend it to pass auth
			// See more here https://stackoverflow.com/questions/4361173/http-headers-in-websockets-client-api
			const ws = getWebSocket(WS_URL || "", [`Bearer-${token}`]);
			setConnState("loading");
			ws.onopen = () => {
				setSocket(ws);
				setConnState("opened");
				console.log("connection opened");
				setTimeout(() => {
					ws.sendJson({ action: "@user:send-profile", payload: { user } });
				}, 1000);
			};
			ws.onerror = () => setConnState("error");
			ws.onclose = () => setConnState("idle");
			return () => {
				socket?.close();
			};
		}
	}, [setSocket, setConnState, connState, token, user, userLoaded]);

	return children;
};
