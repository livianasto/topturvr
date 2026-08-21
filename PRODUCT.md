# Toptur Operations — Documento Central do Produto

## 1. Visão

O **Toptur Operations** é o sistema interno da Toptur para transformar a operação hoje distribuída entre conversas, planilhas e conhecimento pessoal em um fluxo único, rastreável e orientado por dados.

O produto deve ajudar Lívia e Rogério a responder, diariamente:

- O que precisa de atenção agora?
- Quais viagens estão prontas e quais estão em risco?
- Quais oportunidades comerciais precisam de ação?
- Qual é a margem prevista e realizada de cada viagem?
- Quais decisões foram tomadas, por quem e até quando?

## 2. Problema

A Toptur opera com uma equipe enxuta e conhecimento concentrado. Isso cria dependência das pessoas, dificuldade para enxergar prioridades, risco de pendências próximas ao embarque, dados duplicados e pouca visibilidade da rentabilidade por operação.

## 3. Objetivo do produto

Criar uma fonte única de verdade para a gestão das viagens, clientes, oportunidades, fornecedores, tarefas operacionais, receitas, custos, indicadores e decisões da Toptur.

### Resultados esperados

- 100% das operações futuras no calendário único.
- 95% das viagens prontas até D-2.
- Zero conflito de alocação de veículo ou motorista.
- Margem prevista e realizada disponível por viagem.
- Follow-up comercial dentro do prazo em pelo menos 90% das oportunidades.
- Pelo menos 80% das ações gerenciais concluídas no prazo.

## 4. Usuários e papéis iniciais

| Papel | Pessoa inicial | Responsabilidades no sistema |
| --- | --- | --- |
| Direção geral | Rogério | Prioridades, alçadas, aprovações e decisões estratégicas |
| Gestão e operação | Lívia | Administração do sistema, produtos, calendário, comercial, financeiro e indicadores |

O modelo de permissões deve ser baseado em papéis, mesmo com apenas dois usuários, para permitir crescimento sem reestruturação dos dados.

## 5. Escopo

### MVP — Fase 1: Arrumar a casa

- Autenticação, usuários e papéis.
- Painel executivo com alertas e 12 KPIs.
- Cadastro de clientes e contatos.
- Funis separados para excursões, pacotes e fretamentos.
- Calendário único de viagens e operações.
- Checklist de prontidão por viagem.
- Cadastro e homologação de fornecedores.
- DRE prevista e realizada por viagem.
- Cálculo de ocupação, capacidade e break-even.
- Tarefas, responsáveis, prazos e registro de decisões.
- Histórico de alterações relevantes.

### Fase 2: Pilotos e estabilização

- Integração controlada com CRM/WhatsApp.
- Pós-venda, NPS, avaliações e recompra.
- Controle de disponibilidade de veículos e motoristas.
- Documentos e conformidade operacional.
- Exportações e relatórios.

### Fase 3: Diferenciação

- Control Tower integrada.
- Integrações priorizadas por volume e risco.
- Toptur Brain e IA conversacional com dados aprovados.
- Site conectado ao funil comercial.

## 6. Fora do escopo inicial

- Emissão aérea, hoteleira ou fiscal completa.
- ERP contábil próprio.
- Folha de pagamento.
- Aplicativo móvel nativo.
- Substituição integral de soluções especializadas antes da validação dos gaps.
- Automação de decisões financeiras ou operacionais sem aprovação humana.

## 7. Princípios do produto

1. **Processo antes de tecnologia:** nenhum módulo entra em produção sem problema comprovado, processo definido, dono e KPI.
2. **Uma fonte de verdade:** cada dado crítico possui sistema mestre e identificador único.
3. **Ação antes de relatório:** todo alerta deve apontar responsável, prazo e próxima ação.
4. **Poucos campos obrigatórios:** capturar somente o necessário para operar e medir.
5. **Rastreabilidade:** mudanças financeiras, operacionais e de status devem ser auditáveis.
6. **Humano no controle:** IA sugere e resume; pessoas aprovam decisões e comunicações.
7. **Privacidade por padrão:** acesso mínimo necessário e tratamento compatível com a LGPD.

## 8. Jornada principal

1. Um lead entra e é classificado como excursão, pacote ou fretamento.
2. A oportunidade recebe responsável, próxima ação e prazo.
3. A venda confirmada cria ou vincula cliente, passageiros e operação.
4. A viagem recebe capacidade, datas, fornecedores, orçamento e checklist.
5. O sistema calcula ocupação, break-even e prontidão e gera alertas.
6. Após a viagem, receitas, custos e ocorrências são fechados até D+5.
7. O cliente recebe pesquisa de satisfação e pode entrar em fluxo de recompra.
8. KPIs e ações são revisados nos rituais de governança.

## 9. Métricas de sucesso

O dicionário oficial está em `docs/features/analytics.md`. O MVP deve medir K01–K12 definidos no Plano Mestre, sem inventar metas antes da linha de base quando a meta ainda estiver pendente.

## 10. Roadmap e gates

| Fase | Período | Gate |
| --- | --- | --- |
| Arrumar a casa | 0–30 dias | Controles usados por quatro semanas |
| Pilotos | 31–90 dias | Adoção e resultados medidos |
| Estabilização | 3–6 meses | Processos estáveis e dados confiáveis |
| Diferenciação | 6–12 meses | Business case aprovado |

## 11. Critérios de aceite do MVP

- Lívia e Rogério conseguem operar uma viagem ponta a ponta sem controle paralelo obrigatório.
- Toda viagem possui responsável, status, datas, capacidade, checklist e DRE.
- Toda oportunidade ativa possui etapa, responsável e próxima ação.
- Alertas de D-2, break-even e conflitos são visíveis no painel.
- Indicadores possuem definição, fonte e periodicidade documentadas.
- Dados críticos podem ser exportados em formato aberto.
- Permissões e logs de auditoria são testados.

