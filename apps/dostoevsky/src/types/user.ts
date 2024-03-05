import { User as UserType } from "@glimmer/bulgakov";

export type User = Omit<UserType, "id">;
