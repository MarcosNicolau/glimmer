import { ENV_VARS } from "../config/env";

export const isProduction = () => ENV_VARS.NODE_ENV === "production";
