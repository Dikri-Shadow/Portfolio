import { loadConfig } from "./config.js";
import { openDatabase } from "./db/database.js";
import { createLogger } from "./logger.js";
import { createApp } from "./app.js";
import { AssistantService } from "./assistant/service.js";
const config = loadConfig();
const logger = createLogger(config.NODE_ENV === "production");
const db = openDatabase(config.DATABASE_PATH);
const assistant = new AssistantService({
  baseUrl: config.OLLAMA_BASE_URL,
  model: config.OLLAMA_MODEL,
  timeoutMs: config.OLLAMA_TIMEOUT_MS,
});
const app = createApp({
  db,
  logger,
  isProduction: config.NODE_ENV === "production",
  assistant,
});
const server = app.listen(config.PORT, "127.0.0.1", () =>
  logger.info(
    { host: "127.0.0.1", port: config.PORT },
    "Portfolio server ready",
  ),
);
function shutdown(signal: string) {
  logger.info({ signal }, "Graceful shutdown");
  server.close(() => {
    db.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
