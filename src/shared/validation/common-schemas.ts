import { z } from "zod";

/** ADR-003: dinheiro sempre em centavos inteiros + moeda ISO 4217. */
export const amountCentsSchema = z.number().int();
export const currencySchema = z.string().length(3);

export const uuidSchema = z.string().uuid();

/** Datas de negocio em formato ISO local (YYYY-MM-DD). */
export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** Timestamps de evento em UTC. */
export const isoDateTimeSchema = z.string().datetime();

export const humanCodeSchema = z.string().regex(/^[A-Z]+-\d{4}-\d{3,}$/, {
  message: "Codigo deve seguir o padrao PREFIXO-ANO-SEQUENCIA, ex: TRIP-2026-001",
});
