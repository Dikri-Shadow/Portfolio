import express from "express";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import path from "node:path";
import type Database from "better-sqlite3";
import type { Logger } from "pino";
import { assistantSchema, contactSchema } from "./validation.js";
import { storeContact } from "./db/database.js";
import { AssistantService } from "./assistant/service.js";
export function createApp({
  db,
  logger,
  isProduction = false,
  assistant = new AssistantService({
    baseUrl: "http://127.0.0.1:11434",
    model: "",
    timeoutMs: 1500,
  }),
}: {
  db: Database.Database;
  logger: Logger;
  isProduction?: boolean;
  assistant?: AssistantService;
}) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          frameAncestors: ["'none'"],
          formAction: ["'self'"],
        },
      },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: "16kb" }));
  app.get("/api/health", (_req, res) =>
    res.json({
      ok: true,
      service: "portfolio",
      version: "1.0.0",
      time: new Date().toISOString(),
      assistant: assistant.status(),
    }),
  );
  const limiter = rateSome();
  app.post("/api/contact", limiter, (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({
        ok: false,
        error: "Please check the submitted fields.",
        fields: parsed.error.flatten().fieldErrors,
      });
    const input = {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    };
    try {
      const saved = storeContact(db, input);
      logger.info({ contactId: saved.id }, "Contact message stored");
      return res.status(201).json({ ok: true, id: saved.id });
    } catch (error) {
      logger.error({ err: error }, "Contact storage failed");
      return res.status(500).json({
        ok: false,
        error: "Message could not be saved. Please try again.",
      });
    }
  });
  app.post(
    "/api/assistant",
    rateLimit({
      windowMs: 10 * 60 * 1000,
      limit: 10,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: {
        ok: false,
        error: "Too many questions. Please try again later.",
      },
    }),
    async (req, res) => {
      const parsed = assistantSchema.safeParse(req.body);
      if (!parsed.success)
        return res
          .status(400)
          .json({ ok: false, error: "Please enter a valid question." });
      const result = await assistant.answer(parsed.data.question);
      return res.json({ ok: true, ...result });
    },
  );
  if (isProduction) {
    const dist = path.resolve("dist");
    app.use(
      express.static(dist, {
        index: false,
        maxAge: "1h",
        setHeaders: (res, file) => {
          if (file.match(/\.[a-f0-9]{8,}\./))
            res.setHeader("Cache-Control", "public,max-age=31536000,immutable");
        },
      }),
    );
    app.get(/.*/, (req, res, next) => {
      if (req.path.startsWith("/api/")) return next();
      res.sendFile(path.join(dist, "index.html"));
    });
  }
  app.use((_req, res) =>
    res.status(404).json({ ok: false, error: "Not found" }),
  );
  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars -- Express requires four args here.
    ) => {
      logger.error({ err }, "Unhandled request error");
      res.status(500).json({ ok: false, error: "Internal server error" });
    },
  );
  return app;
}
function rateSome() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { ok: false, error: "Too many messages. Please try again later." },
  });
}
