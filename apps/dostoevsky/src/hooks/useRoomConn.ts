"use client";

import { useRoomStore, useSocketStore, useToastsStore } from "apps/dostoevsky/src/state";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Device } from "mediasoup-client";
import { ConsumeParams } from "@glimmer/gogol";
import { createRecvTransport, createSendTransport } from "apps/dostoevsky/src/libs/mediasoup";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer, Transport } from "mediasoup-client/lib/types";
import { useRouter } from "apps/dostoevsky/src/libs/navigation";

export const useHandleRoomConn = () => {
	const { socket, connState } = useSocketStore();
	const {
		id: roomId,
		room,
		transports,
		isLoaded,
		streams,
		setTransports,
		setRoom,
		setMyState,
		setPeer,
		setPeers,
		setStreams,
		setIsLoaded,
	} = useRoomStore();
	const { addToast } = useToastsStore();
	const t = useTranslations("room.toasts");
	const [device, setDevice] = useState<Device | null>(null);
	const [consumers, setConsumers] = useState<Record<string, Consumer>>({});
	const [producer, setProducer] = useState<Producer | null>(null);
	const router = useRouter();

	const createProducer = useCallback(
		async (transport: Transport) => {
			if (!socket || !roomId) return;
			try {
				const res = await navigator.mediaDevices.getUserMedia({
					audio: {
						autoGainControl: true,
						channelCount: 2,
						echoCancellation: true,
						noiseSuppression: true,
						sampleRate: 48000,
						sampleSize: 16,
					},
					video: false,
				});
				//TODO right now we are selecting the default mic, we should let the user choose the entry and pick based on it
				const producer = await transport.produce({ track: res.getAudioTracks()[0] });
				if (producer) {
					setProducer(producer);
					setMyState({ isSpeaker: true, askedToSpeak: false });
				}
			} catch (err: any) {
				const title =
					err.name === "NotAllowedError"
						? t("microphone-not-allowed")
						: t("unexpected-error-while-sending-audio");
				addToast({ title, type: "error" });
			}
		},
		[roomId, socket, addToast, setMyState, t]
	);

	const createConsumer = useCallback(
		async (params: ConsumeParams, transport: Transport) => {
			if (!socket || !roomId) return;
			try {
				const consumer = await transport.consume(params);
				const { appData, track, id } = consumer;
				const mediaStream = new MediaStream();
				mediaStream.addTrack(track);
				setStreams({ [appData.peerId]: mediaStream });
				setConsumers((prev) => ({ ...prev, [appData.peerId]: consumer }));
				socket.sendJson({
					action: "@room:resume-consumer",
					payload: { consumerId: id },
				});
			} catch (err) {
				addToast({ title: t("unexpected-error-while-consuming-audio"), type: "error" });
			}
		},
		[socket, roomId, t, addToast, setStreams]
	);

	useEffect(() => {
		if (!roomId || connState !== "opened") return;
		if (!device) return setDevice(new Device());

		socket?.on("@room:state", ({ room }) => {
			setRoom(room);
		});
		socket?.on("@room:you-joined", async (payload) => {
			if (!device.loaded)
				await device.load({ routerRtpCapabilities: payload.rtpCapabilities });

			const recvTransport = createRecvTransport(payload.recvTransport, device, socket);
			const sendTransport = payload.sendTransport
				? createSendTransport(payload.sendTransport, device, socket)
				: null;

			setTransports({ recv: recvTransport, send: sendTransport });

			addToast({ title: t("new-role", { role: "mod" }) });
			// Create client consumers
			payload.consumers.forEach(async (consumer) => {
				await createConsumer(consumer, recvTransport);
			});

			if (sendTransport) await createProducer(sendTransport);
		});
		socket?.on("@room:new-track", async ({ error, consumerParams }) => {
			if (error || !consumerParams || !transports.recv) return;
			await createConsumer(consumerParams, transports.recv);
		});
		socket?.on("@room:new-peer", ({ peer }) => {
			if (!room) return;
			setPeers([...room.peers, peer]);
		});
		socket?.on("@room:peer-state-changed", ({ peerId, ...state }) => {
			setPeer(peerId, state);
		});
		socket?.on("@room:peer-role-changed", ({ peerId, ...state }) => {
			setPeer(peerId, state);
		});
		socket?.on("@room:you-have-a-new-role", ({ role }) => {
			setMyState({ role });
			addToast({ title: t("new-role", { role }) });
		});
		socket?.on("@room:peer-left", ({ peerId }) => {
			setPeers(room?.peers.filter((peer) => peer.user.id !== peerId) || []);
		});
		socket?.on("@room:you-are-a-producer-now", async (payload) => {
			const sendTransport = createSendTransport(payload.sendTransport, device, socket);
			setTransports({ send: sendTransport });
			await createProducer(sendTransport);
		});
		socket?.on("@room:producer-closed", ({ peerId }) => {
			setConsumers((consumers) => {
				consumers[peerId]?.close();
				delete consumers[peerId];
				return consumers;
			});
			delete streams[peerId];
			setStreams(streams);
		});
		socket?.on("@room:deleted", () => {
			addToast({ title: t("room-deleted"), onTimerEnd: () => router.replace("/") });
		});

		if (!isLoaded && roomId) {
			socket?.sendJson({
				action: "@room:join",
				payload: { roomId },
			});
			setIsLoaded(true);
		}

		return () => {
			socket?.removeEventListener("@room:state");
			socket?.removeEventListener("@room:you-joined");
			socket?.removeEventListener("@room:get-recv-tracks-done");
			socket?.removeEventListener("@room:new-track");
			socket?.removeEventListener("@room:new-peer");
			socket?.removeEventListener("@room:peer-left");
			socket?.removeEventListener("@room:you-are-a-producer-now");
			socket?.removeEventListener("@room:producer-closed");
			socket?.removeEventListener("@room:you-joined");
		};
	}, [
		socket,
		isLoaded,
		roomId,
		transports,
		streams,
		consumers,
		connState,
		device,
		t,
		room,
		router,
		setTransports,
		setPeers,
		setStreams,
		setDevice,
		setIsLoaded,
		setRoom,
		addToast,
		createConsumer,
		createProducer,
		setPeer,
		setMyState,
	]);

	// Resets all state
	useEffect(() => {
		if (!roomId && isLoaded) {
			socket?.sendJson({ action: "@room:leave", payload: {} });
			setMyState(null);
			setRoom(null);
			transports.recv?.close();
			transports.send?.close();
			setTransports({ recv: null, send: null });
			Object.values(consumers).forEach((consumer) => consumer.close());
			setConsumers({});
			producer?.close();
			setProducer(null);
			setStreams({});
			setDevice(null);
			setIsLoaded(false);
		}
	}, [
		roomId,
		isLoaded,
		transports,
		consumers,
		producer,
		setStreams,
		setRoom,
		setIsLoaded,
		setConsumers,
		setProducer,
		setTransports,
		setDevice,
		setMyState,
		socket,
	]);
};
