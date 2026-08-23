import { listItemsBySupplier, listAllItemsWithSupplier } from "../repositories/item.repository";
import type { ItemWithSupplierName } from "../domain/types";

export async function listItemsBySupplierUseCase(supplierId: string) {
  return listItemsBySupplier(supplierId);
}

export async function listAllItemsWithSupplierUseCase(): Promise<ItemWithSupplierName[]> {
  const items = await listAllItemsWithSupplier();
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    capacity: item.capacity,
    supplierId: item.supplierId,
    supplierName: item.supplier.legalName,
  }));
}
