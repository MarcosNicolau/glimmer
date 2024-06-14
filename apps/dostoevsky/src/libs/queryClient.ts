import { APIResponse } from "@glimmer/http";
import { QueryClient, QueryFunctionContext } from "@tanstack/react-query";
import { API_URL } from "apps/dostoevsky/src/libs/constants";
import { APIBaseFetch } from "apps/dostoevsky/src/libs/fetch";
import axios from "axios";

export const defaultQueryFn = async <T extends APIResponse["result"]>({
	queryKey,
}: QueryFunctionContext): Promise<T> => APIBaseFetch("get", `${queryKey[0]}`);

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
