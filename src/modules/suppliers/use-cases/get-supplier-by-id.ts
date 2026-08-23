import { findSupplierById } from "../repositories/supplier.repository";

export async function getSupplierById(id: string) {
  return findSupplierById(id);
}
