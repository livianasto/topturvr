import { getUserRoleIds, setUserRole } from "../repositories/user.repository";
import { recordAuditEvent } from "@/modules/governance";

export interface AssignRoleInput {
  actorId: string;
  userId: string;
  roleId: string;
}

/**
 * Atribui um papel a um usuario e registra o evento de auditoria.
 * BR-SEC-002: mudancas de permissao geram auditoria.
 */
export async function assignRole(input: AssignRoleInput) {
  const before = await getUserRoleIds(input.userId);
  await setUserRole(input.userId, input.roleId);
  const after = await getUserRoleIds(input.userId);

  await recordAuditEvent({
    actorId: input.actorId,
    action: "role.assign",
    entityType: "User",
    entityId: input.userId,
    before: { roleIds: before },
    after: { roleIds: after },
  });

  return { userId: input.userId, roleIds: after };
}
