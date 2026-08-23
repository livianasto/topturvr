import {
  createAuditEvent,
  type CreateAuditEventInput,
} from "../repositories/audit-event.repository";

/**
 * Ponto de entrada publico do modulo governance para registrar auditoria.
 *
 * Outros modulos devem chamar esta funcao, nunca a tabela AuditEvent
 * diretamente (regra de fronteira de modulo - ARCHITECTURE.md secao 3).
 * BR-SEC-002: mudancas de permissao, dados pessoais, status operacional e
 * valores financeiros geram auditoria.
 */
export async function recordAuditEvent(input: CreateAuditEventInput) {
  return createAuditEvent(input);
}
