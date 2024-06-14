import { ENV_VARS } from "../config/env";

export const IS_PROD = ENV_VARS.NODE_ENV === "production";

export * from "./redis";
export * from "./socket";
export * from "./url";
