-- Adiciona o token do link publico de autopreenchimento de passageiros.
-- Feito em tres passos porque a tabela ja tem linhas: cria como opcional,
-- preenche as existentes com UUIDs aleatorios do proprio Postgres, e so
-- entao torna obrigatorio e unico.

ALTER TABLE "reservations" ADD COLUMN "public_token" TEXT;

UPDATE "reservations" SET "public_token" = gen_random_uuid()::text WHERE "public_token" IS NULL;

ALTER TABLE "reservations" ALTER COLUMN "public_token" SET NOT NULL;

CREATE UNIQUE INDEX "reservations_public_token_key" ON "reservations"("public_token");
