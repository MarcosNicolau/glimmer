import { z } from "zod";
import { User } from "../entities";

export const GetTokenReqBody = User;
export type GetTokenReqBody = z.infer<typeof GetTokenReqBody>;

export const GetTokenRes = z.object({ token: z.string() });
export type GetTokenRes = z.infer<typeof GetTokenRes>;
