import pino from "pino";
import { env } from "@/shared/env";

export const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
  redact: ["req.headers.authorization", "*.password", "*.passwordHash", "*.token"],
});
