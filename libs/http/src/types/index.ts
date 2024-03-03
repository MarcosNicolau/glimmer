export type APIResponse<T extends object = object> = {
	status: string | number;
	message: string;
	result: T;
};
