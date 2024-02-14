import { Router, Worker } from "mediasoup/node/lib/types";

export type MyWorker = Worker<{ id: string }>;

export type MyRouter = Router;
