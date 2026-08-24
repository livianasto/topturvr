# Toptur Operations

Sistema interno de gestão da Toptur para centralizar comercial, viagens, fornecedores, rentabilidade, indicadores e decisões.

## Documentação

- [Visão do produto](PRODUCT.md)
- [Arquitetura](ARCHITECTURE.md)
- [Modelo de dados](DATA_MODEL.md)
- [Regras de negócio](BUSINESS_RULES.md)
- [Especificações dos módulos](docs/features/README.md)

## Estado atual

Fundação documental aprovada. Scaffold técnico inicial da Fase 1 em construção (Next.js, Prisma, RBAC, auditoria) — ver seção "Getting started" abaixo. Nenhuma feature de negócio (CRM, viagens, financeiro) foi implementada ainda.

## Getting started

Pré-requisitos: Node.js 20+, Docker Desktop (para PostgreSQL local).

```bash
cp .env.example .env
# edite .env: gere NEXTAUTH_SECRET com `openssl rand -base64 32`

npm install
npm run db:up          # sobe o PostgreSQL via Docker Compose
npm run db:migrate     # cria as tabelas + gera o Prisma Client
npm run db:seed        # cria papéis/permissões (e usuários, se configurados no .env)

npm run dev            # http://localhost:3000
```

Verificação:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`/api/health` reporta o status da conexão com o banco.

## Publicação

Passo a passo para colocar no ar (Railway): [DEPLOY.md](DEPLOY.md).

## Princípio central

Nenhuma tecnologia deve ser implantada sem problema comprovado, processo definido, responsável nomeado, KPI de sucesso e fonte da verdade estabelecida.
