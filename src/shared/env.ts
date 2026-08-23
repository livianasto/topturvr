import { envSchema } from "./env.schema";

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error(
    "Variaveis de ambiente invalidas:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error(
    "Falha na validacao de ambiente - veja os erros acima. Confira seu .env contra .env.example.",
  );
}

export const env = parsed.data;
export type { Env } from "./env.schema";
