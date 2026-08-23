import { listAllReservationsWithRelations } from "../repositories/reservation.repository";
import type { CustomerReportRow } from "../domain/types";

/**
 * Indice do relatorio por cliente: vendas do ano (ou de todo o periodo,
 * se nenhum ano for informado) agrupadas por cliente.
 */
export async function getCustomerReportUseCase(year?: number): Promise<CustomerReportRow[]> {
  const reservations = await listAllReservationsWithRelations(year);

  const byCustomer = new Map<string, CustomerReportRow>();
  for (const reservation of reservations) {
    const customer = reservation.customer;
    const row = byCustomer.get(customer.id) ?? {
      customerId: customer.id,
      customerName: customer.name,
      reservationCount: 0,
      totalSaleCents: 0,
      totalMarginCents: 0,
    };

    row.reservationCount += 1;
    row.totalSaleCents += reservation.saleAmountCents;
    row.totalMarginCents += reservation.marginCents;

    byCustomer.set(customer.id, row);
  }

  return Array.from(byCustomer.values()).sort((a, b) =>
    a.customerName.localeCompare(b.customerName),
  );
}
