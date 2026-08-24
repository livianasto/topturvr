import {
  findPassengerById,
  removePassenger,
} from "../repositories/reservation.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";

export class PassengerNotFoundError extends Error {
  constructor(id: string) {
    super(`Passageiro "${id}" nao encontrado.`);
    this.name = "PassengerNotFoundError";
  }
}

export interface RemovePassengerInput {
  actorId: string;
  actorPermissions: string[];
  passengerId: string;
}

/**
 * Remove um passageiro da lista (correcao de digitacao, desistencia).
 * A remocao e definitiva na tabela, mas o evento de auditoria guarda os
 * dados que existiam antes, entao nada se perde do historico.
 */
export async function removePassengerUseCase(input: RemovePassengerInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.RESERVATION_MANAGE);

  const passenger = await findPassengerById(input.passengerId);
  if (!passenger) {
    throw new PassengerNotFoundError(input.passengerId);
  }

  await removePassenger(input.passengerId);

  await recordAuditEvent({
    actorId: input.actorId,
    action: "reservation_passenger.remove",
    entityType: "ReservationPassenger",
    entityId: input.passengerId,
    before: {
      reservationId: passenger.reservationId,
      fullName: passenger.fullName,
      cpf: passenger.cpf,
      rg: passenger.rg,
      phone: passenger.phone,
    },
  });

  return { reservationId: passenger.reservationId };
}
