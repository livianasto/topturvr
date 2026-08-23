import { archiveCustomer, findCustomerById } from "../repositories/customer.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";

export interface ArchiveCustomerInput {
  actorId: string;
  actorPermissions: string[];
  customerId: string;
}

export async function archiveCustomerUseCase(input: ArchiveCustomerInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.CUSTOMER_MANAGE);

  const before = await findCustomerById(input.customerId);
  const customer = await archiveCustomer(input.customerId);

  await recordAuditEvent({
    actorId: input.actorId,
    action: "customer.archive",
    entityType: "Customer",
    entityId: input.customerId,
    before: { archivedAt: before?.archivedAt?.toISOString() ?? null },
    after: { archivedAt: customer.archivedAt?.toISOString() ?? null },
  });

  return customer;
}
