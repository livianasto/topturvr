import { createOperationForTrip } from "../repositories/operation.repository";
import { recordAuditEvent } from "@/modules/governance";

/**
 * Stub: cria o registro de Operation vinculado 1:1 a uma Trip existente.
 * Placeholder ate o ticket de modulo de operacoes definir o fluxo real
 * (readiness, checklist, alocacao de recursos).
 */
export async function createOperationStub(actorId: string, tripId: string) {
  const operation = await createOperationForTrip(tripId);

  await recordAuditEvent({
    actorId,
    action: "operation.create",
    entityType: "Operation",
    entityId: operation.id,
    after: { tripId, status: operation.status },
  });

  return operation;
}
