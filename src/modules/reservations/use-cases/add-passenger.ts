import { addPassenger } from "../repositories/reservation.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";

export interface AddPassengerInput {
  actorId: string;
  actorPermissions: string[];
  reservationId: string;
  fullName: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  phone?: string;
}

/**
 * Adiciona um passageiro a uma reserva ja existente. Passageiros sao
 * adicionados um de cada vez (sem JS de cliente nao ha como ter linhas
 * dinamicas num unico formulario). Autoatendimento pelo proprio cliente
 * via link e trabalho futuro, ainda nao implementado.
 */
export async function addPassengerUseCase(input: AddPassengerInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.RESERVATION_MANAGE);

  const passenger = await addPassenger({
    reservationId: input.reservationId,
    fullName: input.fullName,
    cpf: input.cpf,
    rg: input.rg,
    birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
    phone: input.phone,
  });

  await recordAuditEvent({
    actorId: input.actorId,
    action: "reservation_passenger.create",
    entityType: "ReservationPassenger",
    entityId: passenger.id,
    after: { reservationId: input.reservationId, fullName: input.fullName },
  });

  return passenger;
}
