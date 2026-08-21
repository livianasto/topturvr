# Regras de Negócio do Toptur Operations

## 1. Governança

- BR-GOV-001: toda ação gerencial possui responsável e prazo.
- BR-GOV-002: somente direção pode cancelar iniciativa, reabrir viagem fechada ou aprovar exceção crítica.
- BR-GOV-003: decisões relevantes registram contexto, decisão, autor e data.
- BR-GOV-004: o painel não altera dados de origem; ele consolida fatos e snapshots.

## 2. Comercial

- BR-CRM-001: existem funis distintos para excursão, pacote e fretamento.
- BR-CRM-002: todo lead recebe data/hora de entrada, origem e tipo de produto.
- BR-CRM-003: o tempo de primeira resposta é a mediana entre entrada e primeira resposta válida.
- BR-CRM-004: toda oportunidade aberta exige responsável, etapa e próxima ação com prazo.
- BR-CRM-005: oportunidade perdida exige motivo de perda padronizado e observação opcional.
- BR-CRM-006: venda só é considerada confirmada quando cumprir a política comercial configurada, incluindo pagamento/sinal quando exigido.
- BR-CRM-007: mensagens automatizadas precisam de template aprovado e opção de intervenção humana.

## 3. Clientes e passageiros

- BR-CUS-001: cliente e passageiro são entidades diferentes; o comprador pode não viajar.
- BR-CUS-002: duplicidade deve ser verificada por documento e, na ausência, por combinação de nome, nascimento e contato.
- BR-CUS-003: dados sensíveis de passageiro são visíveis somente a papéis com necessidade operacional.
- BR-CUS-004: consentimentos e bases legais são registrados por finalidade e data.

## 4. Viagens e operação

- BR-OPS-001: toda viagem possui código único, produto, datas, responsável e capacidade comercializável.
- BR-OPS-002: ocupação = passageiros confirmados ÷ capacidade comercializável.
- BR-OPS-003: checklist é gerado a partir da versão vigente do template, preservando a versão aplicada.
- BR-OPS-004: viagem está pronta em D-2 quando 100% dos itens obrigatórios estão concluídos ou dispensados com justificativa aprovada.
- BR-OPS-005: item vencido ou bloqueado reduz o readiness score e gera alerta ao responsável.
- BR-OPS-006: alteração de data, capacidade, fornecedor crítico ou recurso após confirmação gera evento de auditoria e revalidação dos itens afetados.
- BR-OPS-007: incidentes críticos são escalados imediatamente à direção.

## 5. Fornecedores e recursos

- BR-SUP-001: fornecedor só pode ser usado como aprovado quando cadastro, documentos obrigatórios e homologação estiverem válidos.
- BR-SUP-002: documento expirado bloqueia nova alocação quando for eliminatório para a categoria.
- BR-SUP-003: deve existir alternativa homologada para cada categoria crítica, quando o mercado permitir.
- BR-SUP-004: um veículo ou motorista não pode ter alocações confirmadas sobrepostas.
- BR-SUP-005: avaliação considera preço, pontualidade, qualidade, conformidade e incidentes.

## 6. Financeiro e rentabilidade

- BR-FIN-001: cada viagem possui cenário previsto e realizado na mesma estrutura de categorias.
- BR-FIN-002: receita líquida = receita bruta − descontos − cancelamentos − tributos/taxas configurados.
- BR-FIN-003: margem de contribuição = receita líquida − custos variáveis diretos.
- BR-FIN-004: break-even em passageiros = teto((custos fixos atribuídos + custos variáveis não unitários) ÷ contribuição média por passageiro), com premissas registradas.
- BR-FIN-005: distância do break-even = passageiros confirmados − passageiros necessários para equilíbrio.
- BR-FIN-006: variação de custo = (realizado − previsto) ÷ previsto; quando previsto for zero, o indicador é marcado como exceção, não dividido por zero.
- BR-FIN-007: viagem deve ter DRE realizada fechada até D+5.
- BR-FIN-008: lançamento fechado não é apagado ou sobrescrito; correção exige ajuste ou estorno vinculado.
- BR-FIN-009: valores usam centavos inteiros e moeda explícita; arredondamento ocorre apenas na apresentação ou conforme regra de cobrança.

## 7. Pós-venda

- BR-CX-001: pesquisa de pós-viagem é enviada somente a clientes elegíveis e conforme consentimento/canal permitido.
- BR-CX-002: NPS = percentual de promotores (9–10) − percentual de detratores (0–6).
- BR-CX-003: nota baixa ou incidente aberto cria tarefa de recuperação de serviço.
- BR-CX-004: recompra considera nova compra confirmada dentro do período e segmento configurados.

## 8. Alertas

- BR-ALT-001: alerta possui severidade, entidade, motivo, responsável e estado.
- BR-ALT-002: alertas prioritários: viagem não pronta em D-2, abaixo do break-even no gate, documento crítico vencido, conflito de recurso, follow-up vencido e desvio de custo acima da meta.
- BR-ALT-003: dispensar um alerta exige justificativa e fica registrado.
- BR-ALT-004: notificações não substituem o painel; falha de envio não remove o alerta.

## 9. Indicadores

- BR-KPI-001: toda métrica possui código, definição, cálculo, fonte, frequência e responsável.
- BR-KPI-002: metas marcadas “a definir” só são fixadas após coleta da linha de base.
- BR-KPI-003: snapshots preservam fórmula, período e fonte usados no cálculo.
- BR-KPI-004: indicador manual mostra autor e data da última atualização.

## 10. Segurança e auditoria

- BR-SEC-001: acesso segue o princípio do menor privilégio.
- BR-SEC-002: mudanças de permissão, dados pessoais, status operacional e valores financeiros geram auditoria.
- BR-SEC-003: exportações de dados pessoais são registradas.
- BR-SEC-004: retenção, anonimização e descarte seguem política aprovada pela direção e requisitos legais aplicáveis.
- BR-SEC-005: IA usa apenas fontes aprovadas e não executa comunicação, pagamento, cancelamento ou aprovação sem confirmação humana.

