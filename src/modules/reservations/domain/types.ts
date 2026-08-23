export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface ReservationPassengerInput {
  fullName: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  phone?: string;
}

export interface ReservationListItem {
  id: string;
  voucherNumber: number;
  customerName: string;
  itemName: string;
  supplierName: string;
  departureAt: Date;
  returnAt: Date;
  destinationCity: string;
  destinationState: string;
  saleAmountCents: number;
  marginCents: number;
  status: ReservationStatus;
}

export interface SupplierReportRow {
  supplierId: string;
  supplierName: string;
  reservationCount: number;
  totalPurchaseCents: number;
  totalSaleCents: number;
  totalMarginCents: number;
}

export interface CustomerReportRow {
  customerId: string;
  customerName: string;
  reservationCount: number;
  totalSaleCents: number;
  totalMarginCents: number;
}
