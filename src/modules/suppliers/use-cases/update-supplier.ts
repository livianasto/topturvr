import { findSupplierById, updateSupplier } from "../repositories/supplier.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";
import { SupplierNotFoundError } from "./create-item";

export interface UpdateSupplierInput {
  actorId: string;
  actorPermissions: string[];
  supplierId: string;
  legalName: string;
  document?: string;
  category?: string;
  contactEmail?: string;
  contactPhone?: string;
}

/** Corrige os dados de um fornecedor ja cadastrado. Auditado com antes/depois. */
export async function updateSupplierUseCase(input: UpdateSupplierInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.SUPPLIER_MANAGE);

  const before = await findSupplierById(input.supplierId);
  if (!before) {
    throw new SupplierNotFoundError(input.supplierId);
  }

  const updated = await updateSupplier(input.supplierId, {
    legalName: input.legalName,
    document: input.document ?? null,
    category: input.category ?? null,
    contactEmail: input.contactEmail ?? null,
    contactPhone: input.contactPhone ?? null,
  });

  await recordAuditEvent({
    actorId: input.actorId,
    action: "supplier.update",
    entityType: "Supplier",
    entityId: input.supplierId,
    before: {
      legalName: before.legalName,
      document: before.document,
      category: before.category,
      contactEmail: before.contactEmail,
      contactPhone: before.contactPhone,
    },
    after: {
      legalName: updated.legalName,
      document: updated.document,
      category: updated.category,
      contactEmail: updated.contactEmail,
      contactPhone: updated.contactPhone,
    },
  });

  return updated;
}
