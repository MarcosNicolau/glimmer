"use client";

import { User } from "@glimmer/bulgakov";
import { LOCAL_STORAGE_KEYS } from "apps/dostoevsky/src/libs/constants";
import { useUserStore } from "apps/dostoevsky/src/state";
import { useEffect } from "react";
import { generateRndUser } from "apps/dostoevsky/src/libs/user";

export const LoadUser: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { setUser, setIsLoaded } = useUserStore((state) => state);

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || "{}");
		const userId = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID) || "";
		const { success } = User.safeParse({ ...user, id: userId });

		if (success && userId) {
			setUser({ ...user, id: userId });
			setIsLoaded(true);
			return;
		}
		// delete in case it has garbage
		localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
		localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(generateRndUser()));
		setIsLoaded(true);
	}, [setUser, setIsLoaded]);

	return children;
};
