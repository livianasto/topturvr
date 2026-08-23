import { listAllReservationsWithRelations } from "../repositories/reservation.repository";
import type { SupplierReportRow } from "../domain/types";

/**
 * Indice do relatorio por fornecedor: quantas reservas (veiculos/servicos)
 * estao agendadas com cada fornecedor e os totais financeiros.
 */
export async function getSupplierReportUseCase(): Promise<SupplierReportRow[]> {
  const reservations = await listAllReservationsWithRelations();

  const bySupplier = new Map<string, SupplierReportRow>();
  for (const reservation of reservations) {
    const supplier = reservation.item.supplier;
    const row = bySupplier.get(supplier.id) ?? {
      supplierId: supplier.id,
      supplierName: supplier.legalName,
      reservationCount: 0,
      totalPurchaseCents: 0,
      totalSaleCents: 0,
      totalMarginCents: 0,
    };

    row.reservationCount += 1;
    row.totalPurchaseCents += reservation.purchaseAmountCents;
    row.totalSaleCents += reservation.saleAmountCents;
    row.totalMarginCents += reservation.marginCents;

    bySupplier.set(supplier.id, row);
  }

  return Array.from(bySupplier.values()).sort((a, b) =>
    a.supplierName.localeCompare(b.supplierName),
  );
}
