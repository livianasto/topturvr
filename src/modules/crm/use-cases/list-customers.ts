import { listCustomers } from "../repositories/customer.repository";

export async function listCustomersUseCase() {
  return listCustomers();
}
