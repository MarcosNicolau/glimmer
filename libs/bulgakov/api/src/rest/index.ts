import { z } from "zod";

export const GetTokenReqBody = z.object({});
export type GetTokenReqBody = z.infer<typeof GetTokenReqBody>;

export const GetTokenRes = z.object({ token: z.string() });
export type GetTokenRes = z.infer<typeof GetTokenRes>;
