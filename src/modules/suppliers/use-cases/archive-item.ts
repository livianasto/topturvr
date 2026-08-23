import { archiveItem, findItemById } from "../repositories/item.repository";
import { recordAuditEvent } from "@/modules/governance";
import { requirePermission } from "@/shared/rbac/with-permission";
import { PERMISSIONS } from "@/shared/rbac/permissions";

export interface ArchiveItemInput {
  actorId: string;
  actorPermissions: string[];
  itemId: string;
}

export async function archiveItemUseCase(input: ArchiveItemInput) {
  requirePermission(input.actorPermissions, PERMISSIONS.ITEM_MANAGE);

  const before = await findItemById(input.itemId);
  const item = await archiveItem(input.itemId);

  await recordAuditEvent({
    actorId: input.actorId,
    action: "item.archive",
    entityType: "Item",
    entityId: input.itemId,
    before: { archivedAt: before?.archivedAt?.toISOString() ?? null },
    after: { archivedAt: item.archivedAt?.toISOString() ?? null },
  });

  return item;
}
