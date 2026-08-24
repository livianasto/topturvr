import { findItemById, updateItem } from "../repositories/item.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";
import type { ItemCategory } from "@prisma/client";

export class ItemNotFoundError extends Error {
  constructor(id: string) {
    super(`Item "${id}" nao encontrado.`);
    this.name = "ItemNotFoundError";
  }
}

export interface UpdateItemInput {
  actorId: string;
  actorPermissions: string[];
  itemId: string;
  name: string;
  category: ItemCategory;
  capacity?: number;
  description?: string;
}

/** Corrige os dados de um item do catalogo. Auditado com antes/depois. */
export async function updateItemUseCase(input: UpdateItemInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.ITEM_MANAGE);

  const before = await findItemById(input.itemId);
  if (!before) {
    throw new ItemNotFoundError(input.itemId);
  }

  const updated = await updateItem(input.itemId, {
    name: input.name,
    category: input.category,
    capacity: input.capacity ?? null,
    description: input.description ?? null,
  });

  await recordAuditEvent({
    actorId: input.actorId,
    action: "item.update",
    entityType: "Item",
    entityId: input.itemId,
    before: {
      name: before.name,
      category: before.category,
      capacity: before.capacity,
      description: before.description,
    },
    after: {
      name: updated.name,
      category: updated.category,
      capacity: updated.capacity,
      description: updated.description,
    },
  });

  return updated;
}
