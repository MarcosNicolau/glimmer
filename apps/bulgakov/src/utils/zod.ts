import { z } from "zod";

type ZodParse = <T extends z.ZodType>(
	schema: T,
	objToparse: z.infer<T>,
	params?: z.ParseParams
) => Promise<{ err: z.ZodError | null; output: z.infer<T>; success: boolean }>;

export const zodParseAsync: ZodParse = async (schema, objToParse, params) => {
	try {
		const output = await schema.parseAsync(objToParse, params);
		return { success: true, output: output, err: null };
	} catch (error: any) {
		const err: z.ZodError = error;
		return { success: false, output: null, err };
	}
};
