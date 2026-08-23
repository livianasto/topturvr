/**
 * Contrato para adaptadores de integracao externa (CRM, WhatsApp,
 * pagamentos, backoffice - ver ADR-005 em ARCHITECTURE.md e
 * docs/features/integrations-ai.md). Sem implementacoes ainda; define
 * apenas o formato que futuros adaptadores devem seguir: idempotencia via
 * chave e rastreamento de sincronizacao.
 */
export interface SyncResult {
  status: "SUCCESS" | "ERROR";
  idempotencyKey: string;
  error?: string;
}

export interface IntegrationAdapter<TPayload> {
  provider: string;
  sync(payload: TPayload, idempotencyKey: string): Promise<SyncResult>;
}
