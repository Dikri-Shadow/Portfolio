import "dotenv/config";
import { z } from "zod";
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  SITE_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_PATH: z.string().trim().min(1).default("./data/portfolio.db"),
  CONTACT_EMAIL: z.string().email().or(z.literal("")).default(""),
  OLLAMA_BASE_URL: z
    .string()
    .url()
    .refine(
      (v) => {
        const u = new URL(v);
        return u.hostname === "127.0.0.1" || u.hostname === "localhost";
      },
      { message: "OLLAMA_BASE_URL must be loopback-only" },
    )
    .default("http://127.0.0.1:11434"),
  OLLAMA_MODEL: z.string().trim().max(120).default(""),
  OLLAMA_TIMEOUT_MS: z.coerce.number().int().min(1000).max(30000).default(20000),
});
export type AppConfig = z.infer<typeof schema>;
export function loadConfig(
  overrides: Partial<Record<keyof AppConfig, string | number>> = {},
) {
  const result = schema.safeParse({ ...process.env, ...overrides });
  if (!result.success) {
    throw new Error(
      `Invalid environment configuration: ${result.error.issues.map((i) => i.path.join(".")).join(", ")}`,
    );
  }
  return result.data;
}
