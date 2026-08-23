import { prisma } from "@/shared/db/prisma";
import type { PermissionKey } from "./permissions";

/**
 * Checagem pura de permissao, sem acesso a banco - usada quando as
 * permissoes ja foram resolvidas (ex: anexadas a sessao no login).
 * Testavel isoladamente.
 */
export function canSync(permissions: string[], key: PermissionKey): boolean {
  return permissions.includes(key);
}

/**
 * Resolve as permissoes de um usuario a partir do banco (papeis -> permissoes)
 * e checa a chave solicitada. Prefira anexar `permissions` na sessao
 * (ver shared/auth) e usar canSync para evitar uma query por checagem.
 */
export async function can(userId: string, key: PermissionKey): Promise<boolean> {
  const permissions = await resolveUserPermissions(userId);
  return canSync(permissions, key);
}

export async function resolveUserPermissions(userId: string): Promise<string[]> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: { include: { permissions: { include: { permission: true } } } } },
  });

  const permissionKeys = new Set<string>();
  for (const userRole of userRoles) {
    for (const rolePermission of userRole.role.permissions) {
      permissionKeys.add(rolePermission.permission.key);
    }
  }

  return Array.from(permissionKeys);
}
