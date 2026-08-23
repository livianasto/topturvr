import pino from "pino";
import { env } from "@/shared/env";

/**
 * O transport "pino-pretty" roda em worker thread e nao e empacotado pelo
 * Next.js, o que derruba o servidor com MODULE_NOT_FOUND. Por isso o
 * pretty-print so e habilitado fora do runtime do Next (ex: scripts como
 * prisma/seed.ts); dentro da aplicacao usamos JSON estruturado puro.
 */
const isNextRuntime = Boolean(process.env.NEXT_RUNTIME);
const usePrettyTransport = env.NODE_ENV === "development" && !isNextRuntime;

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: usePrettyTransport
    ? { target: "pino-pretty", options: { colorize: true } }
    : undefined,
  redact: ["req.headers.authorization", "*.password", "*.passwordHash", "*.token"],
});
