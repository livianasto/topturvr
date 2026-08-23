import { createReservation } from "../repositories/reservation.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";
import { getCustomerById } from "@/modules/crm";
import { getItemById } from "@/modules/suppliers";

export interface CreateReservationInput {
  actorId: string;
  actorPermissions: string[];
  customerId: string;
  itemId: string;
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

export class CustomerNotFoundError extends Error {
  constructor(customerId: string) {
    super(`Cliente "${customerId}" nao encontrado.`);
    this.name = "CustomerNotFoundError";
  }
}

export class ItemNotFoundError extends Error {
  constructor(itemId: string) {
    super(`Item "${itemId}" nao encontrado.`);
    this.name = "ItemNotFoundError";
  }
}

/**
 * Cria uma reserva standalone (sem Trip/Operation) - decisao de produto
 * confirmada com o usuario. O fornecedor vem implicito via Item.supplier.
 * A margem e calculada aqui (nao e input do usuario) e armazenada junto
 * com a reserva para os relatorios nao precisarem recalcular.
 */
export async function createReservationUseCase(input: CreateReservationInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.RESERVATION_MANAGE);

  const customer = await getCustomerById(input.customerId);
  if (!customer) {
    throw new CustomerNotFoundError(input.customerId);
  }

  const item = await getItemById(input.itemId);
  if (!item) {
    throw new ItemNotFoundError(input.itemId);
  }

  const marginCents = input.saleAmountCents - input.purchaseAmountCents;

  const reservation = await createReservation({
    customerId: input.customerId,
    itemId: input.itemId,
    departureAt: new Date(input.departureAt),
    returnAt: new Date(input.returnAt),
    destinationCity: input.destinationCity,
    destinationState: input.destinationState.toUpperCase(),
    tourStops: input.tourStops,
    purchaseAmountCents: input.purchaseAmountCents,
    saleAmountCents: input.saleAmountCents,
    marginCents,
    responsibleName: input.responsibleName,
    responsiblePhone: input.responsiblePhone,
    customerNotes: input.customerNotes,
    supplierNotes: input.supplierNotes,
    createdBy: input.actorId,
  });

  await recordAuditEvent({
    actorId: input.actorId,
    action: "reservation.create",
    entityType: "Reservation",
    entityId: reservation.id,
    after: {
      voucherNumber: reservation.voucherNumber,
      customerId: reservation.customerId,
      itemId: reservation.itemId,
      saleAmountCents: reservation.saleAmountCents,
      purchaseAmountCents: reservation.purchaseAmountCents,
      marginCents: reservation.marginCents,
    },
  });

  return reservation;
}
