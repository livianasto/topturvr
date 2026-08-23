import { describe, expect, it } from "vitest";
import { envSchema } from "./env.schema";

const validEnv = {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
  NEXTAUTH_SECRET: "a".repeat(32),
};

describe("envSchema", () => {
  it("aceita uma configuracao valida", () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });

  it("rejeita quando DATABASE_URL esta ausente", () => {
    const { DATABASE_URL: _omit, ...rest } = validEnv;
    const result = envSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejeita NEXTAUTH_SECRET curto demais", () => {
    const result = envSchema.safeParse({ ...validEnv, NEXTAUTH_SECRET: "curto" });
    expect(result.success).toBe(false);
  });

  it("aplica o default de LOG_LEVEL quando ausente", () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success && result.data.LOG_LEVEL).toBe("info");
  });
});
