import { findCustomerById } from "../repositories/customer.repository";

export async function getCustomerById(id: string) {
  return findCustomerById(id);
}
