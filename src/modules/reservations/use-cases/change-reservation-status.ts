import {
  findReservationById,
  updateReservationStatus,
} from "../repositories/reservation.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";
import { ReservationNotFoundError } from "./update-reservation";

export class InvalidStatusTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Transicao de status invalida: ${from} -> ${to}.`);
    this.name = "InvalidStatusTransitionError";
  }
}

export interface ChangeReservationStatusInput {
  actorId: string;
  actorPermissions: string[];
  reservationId: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

/**
 * Transicoes permitidas:
 *   PENDING   -> CONFIRMED | CANCELLED
 *   CONFIRMED -> CANCELLED
 *   CANCELLED -> (nenhuma; reserva cancelada e terminal)
 *
 * Cancelar nunca apaga o registro: o voucher e preservado para
 * conferencia, apenas sai dos totais dos relatorios.
 */
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CANCELLED"],
  CANCELLED: [],
};

export async function changeReservationStatusUseCase(input: ChangeReservationStatusInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.RESERVATION_MANAGE);

  const reservation = await findReservationById(input.reservationId);
  if (!reservation) {
    throw new ReservationNotFoundError(input.reservationId);
  }

  const allowed = ALLOWED_TRANSITIONS[reservation.status] ?? [];
  if (!allowed.includes(input.status)) {
    throw new InvalidStatusTransitionError(reservation.status, input.status);
  }

  const updated = await updateReservationStatus(input.reservationId, input.status);

  await recordAuditEvent({
    actorId: input.actorId,
    action: `reservation.${input.status.toLowerCase()}`,
    entityType: "Reservation",
    entityId: input.reservationId,
    before: { status: reservation.status },
    after: { status: updated.status },
  });

  return updated;
}
