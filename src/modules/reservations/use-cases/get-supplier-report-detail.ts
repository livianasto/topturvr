import { listReservationsBySupplier } from "../repositories/reservation.repository";

/**
 * Detalhe do relatorio de um fornecedor: quais reservas (cliente, item,
 * datas) estao agendadas com ele - "para quem estou agendando".
 */
export async function getSupplierReportDetailUseCase(supplierId: string) {
  const reservations = await listReservationsBySupplier(supplierId);

  const totals = reservations.reduce(
    (acc, reservation) => ({
      reservationCount: acc.reservationCount + 1,
      totalPurchaseCents: acc.totalPurchaseCents + reservation.purchaseAmountCents,
      totalSaleCents: acc.totalSaleCents + reservation.saleAmountCents,
      totalMarginCents: acc.totalMarginCents + reservation.marginCents,
    }),
    { reservationCount: 0, totalPurchaseCents: 0, totalSaleCents: 0, totalMarginCents: 0 },
  );

  return { reservations, totals };
}
