import {
  findPassengerById,
  updatePassenger,
} from "../repositories/reservation.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";
import { PassengerNotFoundError } from "./remove-passenger";

export interface UpdatePassengerInput {
  actorId: string;
  actorPermissions: string[];
  passengerId: string;
  fullName: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  phone?: string;
}

/**
 * Corrige os dados de um passageiro ja cadastrado (nome digitado errado,
 * CPF faltando etc). A auditoria guarda o antes e o depois.
 */
export async function updatePassengerUseCase(input: UpdatePassengerInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.RESERVATION_MANAGE);

  const before = await findPassengerById(input.passengerId);
  if (!before) {
    throw new PassengerNotFoundError(input.passengerId);
  }

  const updated = await updatePassenger(input.passengerId, {
    fullName: input.fullName,
    cpf: input.cpf ?? null,
    rg: input.rg ?? null,
    birthDate: input.birthDate ? new Date(input.birthDate) : null,
    phone: input.phone ?? null,
  });

  await recordAuditEvent({
    actorId: input.actorId,
    action: "reservation_passenger.update",
    entityType: "ReservationPassenger",
    entityId: input.passengerId,
    before: {
      fullName: before.fullName,
      cpf: before.cpf,
      rg: before.rg,
      birthDate: before.birthDate?.toISOString() ?? null,
      phone: before.phone,
    },
    after: {
      fullName: updated.fullName,
      cpf: updated.cpf,
      rg: updated.rg,
      birthDate: updated.birthDate?.toISOString() ?? null,
      phone: updated.phone,
    },
  });

  return { ...updated, reservationId: before.reservationId };
}
