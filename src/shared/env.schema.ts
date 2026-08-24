import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
  /** Conexao direta ao banco, usada apenas pelas migracoes do Prisma. */
  DIRECT_DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url().optional(),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  /** Endereco que recebe copia oculta (CCO) dos e-mails de reserva. */
  TOPTUR_COPY_EMAIL: z.string().email().optional(),
  SEED_LIVIA_EMAIL: z.string().email().optional(),
  SEED_LIVIA_PASSWORD: z.string().min(8).optional(),
  SEED_ROGERIO_EMAIL: z.string().email().optional(),
  SEED_ROGERIO_PASSWORD: z.string().min(8).optional(),
});

export type Env = z.infer<typeof envSchema>;
