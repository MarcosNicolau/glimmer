"use client";
import { useHandleRoomConn } from "apps/dostoevsky/src/hooks/useRoomConn";

export const RoomConnection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	useHandleRoomConn();

	return children;
};
