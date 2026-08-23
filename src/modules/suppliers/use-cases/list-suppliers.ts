import { listSuppliers } from "../repositories/supplier.repository";

export async function listSuppliersUseCase() {
  return listSuppliers();
}
