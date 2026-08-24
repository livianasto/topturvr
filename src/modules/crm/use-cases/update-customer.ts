import { findCustomerById, updateCustomer } from "../repositories/customer.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";

export class CustomerNotFoundError extends Error {
  constructor(id: string) {
    super(`Cliente "${id}" nao encontrado.`);
    this.name = "CustomerNotFoundError";
  }
}

export interface UpdateCustomerInput {
  actorId: string;
  actorPermissions: string[];
  customerId: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
}

/** Corrige os dados de um cliente ja cadastrado. Auditado com antes/depois. */
export async function updateCustomerUseCase(input: UpdateCustomerInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.CUSTOMER_MANAGE);

  const before = await findCustomerById(input.customerId);
  if (!before) {
    throw new CustomerNotFoundError(input.customerId);
  }

  const updated = await updateCustomer(input.customerId, {
    name: input.name,
    document: input.document ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
  });

  await recordAuditEvent({
    actorId: input.actorId,
    action: "customer.update",
    entityType: "Customer",
    entityId: input.customerId,
    before: {
      name: before.name,
      document: before.document,
      email: before.email,
      phone: before.phone,
    },
    after: {
      name: updated.name,
      document: updated.document,
      email: updated.email,
      phone: updated.phone,
    },
  });

  return updated;
}
