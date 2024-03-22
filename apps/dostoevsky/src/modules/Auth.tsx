"use client";
import { GetTokenReqBody, GetTokenRes } from "@glimmer/bulgakov";
import { useMutation } from "@tanstack/react-query";
import { LOCAL_STORAGE_KEYS } from "apps/dostoevsky/src/libs/constants";
import { defaultMutationFn } from "apps/dostoevsky/src/libs/queryClient";
import { useTokenStore } from "apps/dostoevsky/src/state";
import { useEffect } from "react";

export const Auth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { setToken, token } = useTokenStore((state) => state);
	const { isPending, mutate } = useMutation({
		mutationFn: defaultMutationFn<GetTokenRes, GetTokenReqBody>("/auth/token"),
		onSuccess(data) {
			setToken(data.token);
			const tokenPayload = JSON.parse(atob(data.token.split(".")[1]));
			localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, data.token);
			localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, tokenPayload.id);
		},
	});

	useEffect(() => {
		const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
		const userId = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID);
		if (!token || !userId) return mutate({});
		setToken(token);
	}, [mutate, setToken]);

	//TODO loader
	if (isPending || !token) return <h1>Loading...</h1>;
	else return children;
};
