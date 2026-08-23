import { createSupplier } from "../repositories/supplier.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";

export interface CreateSupplierInput {
  actorId: string;
  actorPermissions: string[];
  legalName: string;
  document?: string;
  category?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export async function createSupplierUseCase(input: CreateSupplierInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.SUPPLIER_MANAGE);

  const supplier = await createSupplier({
    legalName: input.legalName,
    document: input.document,
    category: input.category,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone,
    createdBy: input.actorId,
  });

  await recordAuditEvent({
    actorId: input.actorId,
    action: "supplier.create",
    entityType: "Supplier",
    entityId: supplier.id,
    after: {
      legalName: supplier.legalName,
      document: supplier.document,
      category: supplier.category,
      contactEmail: supplier.contactEmail,
      contactPhone: supplier.contactPhone,
    },
  });

  return supplier;
}
