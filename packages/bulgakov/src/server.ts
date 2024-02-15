import { loadRedis, loadRabbit, loadSocket } from "./loaders";

const startServer = async () => {
    try {
        await loadRedis();
        await loadRabbit();
        loadSocket();
    } catch (err) {
        console.error("could not start server", err);
        process.exit(1);
    }
};

startServer();
