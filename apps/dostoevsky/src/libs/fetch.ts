import { APIResponse } from "@glimmer/http";
import { API_URL } from "apps/dostoevsky/src/libs/constants";
import axios from "axios";

export const APIBaseFetch = async <ResponseResult extends object>(
	method: "get" | "post" | "put" | "delete" | "options" | "head",
	path: string
) => {
	const res = await axios[method]<APIResponse<ResponseResult>>(`${API_URL}${path}`);
	if (res.data.status !== 200) throw new Error(res.data.message);
	return res.data.result;
};
