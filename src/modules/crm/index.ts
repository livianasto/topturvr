export { createCustomerUseCase as createCustomer } from "./use-cases/create-customer";
export { listCustomersUseCase as listCustomers } from "./use-cases/list-customers";
export { archiveCustomerUseCase as archiveCustomer } from "./use-cases/archive-customer";
export {
  updateCustomerUseCase as updateCustomer,
  CustomerNotFoundError,
} from "./use-cases/update-customer";
export { getCustomerById } from "./use-cases/get-customer-by-id";
export type { CustomerSummary, CustomerStatus } from "./domain/types";
