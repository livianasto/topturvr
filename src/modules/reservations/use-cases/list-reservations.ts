import { listReservations } from "../repositories/reservation.repository";
import type { ReservationListItem } from "../domain/types";

export async function listReservationsUseCase(): Promise<ReservationListItem[]> {
  const reservations = await listReservations();
  return reservations.map((reservation) => ({
    id: reservation.id,
    voucherNumber: reservation.voucherNumber,
    customerName: reservation.customer.name,
    itemName: reservation.item.name,
    supplierName: reservation.item.supplier.legalName,
    departureAt: reservation.departureAt,
    returnAt: reservation.returnAt,
    destinationCity: reservation.destinationCity,
    destinationState: reservation.destinationState,
    saleAmountCents: reservation.saleAmountCents,
    marginCents: reservation.marginCents,
    status: reservation.status,
  }));
}
