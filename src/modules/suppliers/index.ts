export { createSupplierUseCase as createSupplier } from "./use-cases/create-supplier";
export { listSuppliersUseCase as listSuppliers } from "./use-cases/list-suppliers";
export { archiveSupplierUseCase as archiveSupplier } from "./use-cases/archive-supplier";
export { getSupplierById } from "./use-cases/get-supplier-by-id";

export {
  createItemUseCase as createItem,
  SupplierNotFoundError,
} from "./use-cases/create-item";
export {
  listItemsBySupplierUseCase as listItemsBySupplier,
  listAllItemsWithSupplierUseCase as listAllItemsWithSupplier,
} from "./use-cases/list-items";
export { archiveItemUseCase as archiveItem } from "./use-cases/archive-item";
export { getItemById } from "./use-cases/get-item-by-id";

export type {
  SupplierSummary,
  SupplierStatus,
  ItemStatus,
  ItemCategory,
  ItemWithSupplierName,
} from "./domain/types";
