import { createCustomer } from "../repositories/customer.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";

export interface CreateCustomerInput {
  actorId: string;
  actorPermissions: string[];
  name: string;
  document?: string;
  email?: string;
  phone?: string;
}

export async function createCustomerUseCase(input: CreateCustomerInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.CUSTOMER_MANAGE);

  const customer = await createCustomer({
    name: input.name,
    document: input.document,
    email: input.email,
    phone: input.phone,
    createdBy: input.actorId,
  });

  await recordAuditEvent({
    actorId: input.actorId,
    action: "customer.create",
    entityType: "Customer",
    entityId: customer.id,
    after: { name: customer.name, document: customer.document, email: customer.email, phone: customer.phone },
  });

  return customer;
}
