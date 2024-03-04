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
			localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, data.token);
		},
	});

	useEffect(() => {
		const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
		if (!token) return mutate({});
		setToken(token);
	}, [mutate]);

	//TODO loader
	if (isPending || !token) return <h1>Loading...</h1>;
	else return children;
};
