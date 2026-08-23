import { listReservationsByCustomer } from "../repositories/reservation.repository";

/** Detalhe do relatorio de um cliente: reservas do periodo/ano e totais. */
export async function getCustomerReportDetailUseCase(customerId: string, year?: number) {
  const reservations = await listReservationsByCustomer(customerId, year);

  const totals = reservations.reduce(
    (acc, reservation) => ({
      reservationCount: acc.reservationCount + 1,
      totalSaleCents: acc.totalSaleCents + reservation.saleAmountCents,
      totalMarginCents: acc.totalMarginCents + reservation.marginCents,
    }),
    { reservationCount: 0, totalSaleCents: 0, totalMarginCents: 0 },
  );

  return { reservations, totals };
}
