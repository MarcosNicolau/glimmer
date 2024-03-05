export type GenerateBasicStoreActions<T extends string> = {
	[key in `set${Capitalize<T>}`]: (_: any) => void;
};
