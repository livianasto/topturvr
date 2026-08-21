# Arquitetura do Toptur Operations

## 1. Decisão arquitetural

Adotar um **monólito modular web**, responsivo e orientado a domínio. Essa abordagem reduz custo operacional e complexidade para a equipe atual, mantendo limites claros entre módulos para futuras integrações ou extrações de serviços.

## 2. Stack proposta

| Camada | Tecnologia | Motivo |
| --- | --- | --- |
| Aplicação web | Next.js + TypeScript | Frontend e backend no mesmo projeto, tipagem e boa produtividade |
| Interface | React + Tailwind CSS + biblioteca acessível de componentes | Consistência visual e velocidade de construção |
| Banco | PostgreSQL | Integridade relacional, relatórios e transações |
| Persistência | Prisma ORM | Migrações, tipagem e manutenção simples |
| Autenticação | Provedor gerenciado compatível com e-mail e MFA | Evitar construir segurança de identidade do zero |
| Arquivos | Object storage privado compatível com S3 | Documentos de viagens e fornecedores fora do banco |
| Jobs | Fila/cron gerenciado | Alertas D-2, follow-ups e consolidação de KPIs |
| Observabilidade | Logs estruturados + rastreamento de erros | Diagnóstico e auditoria operacional |
| Testes | Vitest + Playwright | Regras unitárias e fluxos críticos ponta a ponta |
| Deploy | Plataforma gerenciada para app + PostgreSQL | Menor esforço de infraestrutura |

As marcas e fornecedores devem ser escolhidos após comparar aderência, integração, custo total, exportação, segurança, suporte e estabilidade, conforme a matriz do Plano Mestre.

## 3. Organização lógica

```text
src/
  app/                 rotas e telas
  modules/
    identity/          usuários, papéis e permissões
    crm/               clientes, leads e oportunidades
    operations/        viagens, saídas e checklist
    suppliers/         fornecedores e recursos
    finance/           DRE, receitas, custos e break-even
    governance/        tarefas, decisões e rituais
    analytics/         KPIs, snapshots e painel
    integrations/      adaptadores externos
  shared/              tipos, UI, validações e infraestrutura comum
prisma/
  schema.prisma
docs/features/
```

Cada módulo expõe casos de uso; telas e integrações não acessam tabelas de outro módulo diretamente.

## 4. Fluxo técnico

1. A interface chama uma action ou endpoint autenticado.
2. A camada de aplicação valida entrada, papel e regra de negócio.
3. O caso de uso executa uma transação no PostgreSQL.
4. Eventos internos registram auditoria e disparam tarefas assíncronas.
5. Jobs calculam alertas e snapshots sem alterar lançamentos de origem.

## 5. Decisões técnicas

### ADR-001 — Monólito modular

- **Status:** aceito.
- **Motivo:** equipe pequena, domínio ainda em validação e baixo benefício atual de microsserviços.
- **Consequência:** uma implantação principal; limites de módulo devem ser fiscalizados no código.

### ADR-002 — PostgreSQL como fonte operacional

- **Status:** aceito.
- **Motivo:** viagens, passageiros, fornecedores e finanças exigem consistência e relacionamentos.
- **Consequência:** documentos ficam no object storage, com metadados e permissões no banco.

### ADR-003 — Dinheiro em centavos

- **Status:** aceito.
- **Regra:** valores monetários são armazenados como inteiros em centavos e moeda ISO 4217; nunca como ponto flutuante.

### ADR-004 — Histórico financeiro imutável

- **Status:** aceito.
- **Regra:** lançamentos fechados não são sobrescritos; correções geram estorno ou ajuste vinculado.

### ADR-005 — Integrações por adaptadores

- **Status:** aceito.
- **Regra:** CRM, WhatsApp, pagamentos e backoffice entram por interfaces internas, com idempotência e log de sincronização.

## 6. Segurança e LGPD

- Autenticação forte e MFA disponível para administradores.
- Controle de acesso por papel e, quando necessário, por operação.
- Criptografia em trânsito e em repouso nos serviços gerenciados.
- Segredos somente no gerenciador de ambiente; nunca no repositório.
- Logs sem senhas, tokens, documentos completos ou dados excessivos.
- Registro de acesso e alteração para dados críticos.
- Política de retenção e anonimização definida antes de produção.
- Backups automáticos e teste periódico de restauração.

## 7. Ambientes e entrega

| Ambiente | Uso | Dados |
| --- | --- | --- |
| Local | Desenvolvimento | Sintéticos |
| Preview | Revisão de cada mudança | Sintéticos/anônimos |
| Produção | Operação real | Reais, acesso restrito |

Pipeline mínimo: lint, verificação de tipos, testes unitários, migração validada, testes de fluxo crítico e deploy com rollback.

## 8. Requisitos não funcionais iniciais

- Interface responsiva para desktop e celular.
- Ações comuns com resposta percebida inferior a 2 segundos em condições normais.
- Exportação CSV/XLSX dos cadastros e relatórios essenciais.
- Acessibilidade de teclado e contraste adequado.
- Datas armazenadas em UTC e exibidas no fuso `America/Sao_Paulo`.
- IDs internos UUID; códigos humanos separados e legíveis.

## 9. Evolução planejada

Extrair um serviço somente quando houver evidência de escala, isolamento de segurança, cadência de deploy distinta ou integração complexa. IA e BI consomem visões aprovadas; não acessam irrestritamente o banco transacional.

