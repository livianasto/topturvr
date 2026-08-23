import { archiveSupplier, findSupplierById } from "../repositories/supplier.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";

export interface ArchiveSupplierInput {
  actorId: string;
  actorPermissions: string[];
  supplierId: string;
}

export async function archiveSupplierUseCase(input: ArchiveSupplierInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.SUPPLIER_MANAGE);

  const before = await findSupplierById(input.supplierId);
  const supplier = await archiveSupplier(input.supplierId);

  await recordAuditEvent({
    actorId: input.actorId,
    action: "supplier.archive",
    entityType: "Supplier",
    entityId: input.supplierId,
    before: { archivedAt: before?.archivedAt?.toISOString() ?? null },
    after: { archivedAt: supplier.archivedAt?.toISOString() ?? null },
  });

  return supplier;
}
