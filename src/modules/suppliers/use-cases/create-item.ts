import { createItem } from "../repositories/item.repository";
import { findSupplierById } from "../repositories/supplier.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";
import type { ItemCategory } from "@prisma/client";

export interface CreateItemInput {
  actorId: string;
  actorPermissions: string[];
  supplierId: string;
  name: string;
  category: ItemCategory;
  capacity?: number;
  description?: string;
}

export class SupplierNotFoundError extends Error {
  constructor(supplierId: string) {
    super(`Fornecedor "${supplierId}" nao encontrado ou arquivado.`);
    this.name = "SupplierNotFoundError";
  }
}

export async function createItemUseCase(input: CreateItemInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.ITEM_MANAGE);

  const supplier = await findSupplierById(input.supplierId);
  if (!supplier || supplier.archivedAt) {
    throw new SupplierNotFoundError(input.supplierId);
  }

  const item = await createItem({
    supplierId: input.supplierId,
    name: input.name,
    category: input.category,
    capacity: input.capacity,
    description: input.description,
    createdBy: input.actorId,
  });

  await recordAuditEvent({
    actorId: input.actorId,
    action: "item.create",
    entityType: "Item",
    entityId: item.id,
    after: {
      supplierId: item.supplierId,
      name: item.name,
      category: item.category,
      capacity: item.capacity,
    },
  });

  return item;
}
