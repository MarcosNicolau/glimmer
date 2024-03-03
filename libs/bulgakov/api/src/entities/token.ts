import { User } from "./user";
import { z } from "zod";

export const TokenPayload = User;
export type TokenPayload = z.infer<typeof TokenPayload>;
