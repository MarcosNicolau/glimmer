import { APIResponse } from "@glimmer/http";
import { QueryClient, QueryFunctionContext } from "@tanstack/react-query";
import { API_URL } from "apps/dostoevsky/src/libs/constants";
import axios from "axios";

const defaultQueryFn = async <T extends APIResponse["result"]>({
	queryKey,
}: QueryFunctionContext): Promise<T> => {
	const res = await axios.get<APIResponse<T>>(`${API_URL}${queryKey[0]}`);
	return res.data.result;
};

export const defaultMutationFn =
	<Result extends APIResponse["result"], Payload extends object>(path: string) =>
	async (payload: Payload) => {
		const res = await axios.post<APIResponse<Result>>(`${API_URL}${path}`, payload);
		return res.data.result;
	};

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: { queryFn: defaultQueryFn },
		mutations: {},
	},
});
