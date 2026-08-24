import {
  findReservationById,
  updateReservation,
} from "../repositories/reservation.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";

export class ReservationNotFoundError extends Error {
  constructor(id: string) {
    super(`Reserva "${id}" nao encontrada.`);
    this.name = "ReservationNotFoundError";
  }
}

export class CancelledReservationError extends Error {
  constructor() {
    super("Reserva cancelada nao pode ser editada. Crie uma nova reserva.");
    this.name = "CancelledReservationError";
  }
}

export interface UpdateReservationInput {
  actorId: string;
  actorPermissions: string[];
  reservationId: string;
  departureAt: string;
  returnAt: string;
  destinationCity: string;
  destinationState: string;
  tourStops?: string;
  purchaseAmountCents: number;
  saleAmountCents: number;
  responsibleName: string;
  responsiblePhone?: string;
  customerNotes?: string;
  supplierNotes?: string;
}

/**
 * Edita os dados de uma reserva existente. Cliente, item e numero do
 * voucher NAO sao editaveis: o voucher e referencia permanente da venda,
 * e trocar cliente/fornecedor descaracterizaria o registro - nesses
 * casos o certo e cancelar e criar outra reserva.
 *
 * A margem e recalculada aqui, nunca recebida do formulario.
 */
export async function updateReservationUseCase(input: UpdateReservationInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.RESERVATION_MANAGE);

  const before = await findReservationById(input.reservationId);
  if (!before) {
    throw new ReservationNotFoundError(input.reservationId);
  }
  if (before.status === "CANCELLED") {
    throw new CancelledReservationError();
  }

  const marginCents = input.saleAmountCents - input.purchaseAmountCents;

  const updated = await updateReservation(input.reservationId, {
    departureAt: new Date(input.departureAt),
    returnAt: new Date(input.returnAt),
    destinationCity: input.destinationCity,
    destinationState: input.destinationState.toUpperCase(),
    tourStops: input.tourStops ?? null,
    purchaseAmountCents: input.purchaseAmountCents,
    saleAmountCents: input.saleAmountCents,
    marginCents,
    responsibleName: input.responsibleName,
    responsiblePhone: input.responsiblePhone ?? null,
    customerNotes: input.customerNotes ?? null,
    supplierNotes: input.supplierNotes ?? null,
  });

  await recordAuditEvent({
    actorId: input.actorId,
    action: "reservation.update",
    entityType: "Reservation",
    entityId: input.reservationId,
    before: {
      departureAt: before.departureAt.toISOString(),
      returnAt: before.returnAt.toISOString(),
      destinationCity: before.destinationCity,
      destinationState: before.destinationState,
      purchaseAmountCents: before.purchaseAmountCents,
      saleAmountCents: before.saleAmountCents,
      marginCents: before.marginCents,
      responsibleName: before.responsibleName,
    },
    after: {
      departureAt: updated.departureAt.toISOString(),
      returnAt: updated.returnAt.toISOString(),
      destinationCity: updated.destinationCity,
      destinationState: updated.destinationState,
      purchaseAmountCents: updated.purchaseAmountCents,
      saleAmountCents: updated.saleAmountCents,
      marginCents: updated.marginCents,
      responsibleName: updated.responsibleName,
    },
  });

  return updated;
}
