export type SupplierStatus = "ACTIVE" | "INACTIVE";
export type ItemStatus = "ACTIVE" | "INACTIVE";
export type ItemCategory = "VEHICLE" | "HOTEL" | "INSURANCE" | "OTHER";

export interface SupplierSummary {
  id: string;
  legalName: string;
  document: string | null;
  category: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status: SupplierStatus;
}

export interface ItemWithSupplierName {
  id: string;
  name: string;
  category: ItemCategory;
  capacity: number | null;
  supplierId: string;
  supplierName: string;
}
