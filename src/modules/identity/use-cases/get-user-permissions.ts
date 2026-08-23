import { findUserWithRolesAndPermissions } from "../repositories/user.repository";
import type { UserWithRoles } from "../domain/types";

export async function getUserPermissions(userId: string): Promise<UserWithRoles | null> {
  const user = await findUserWithRolesAndPermissions(userId);
  if (!user) return null;

  const roles: string[] = [];
  const permissionKeys = new Set<string>();

  for (const userRole of user.roles) {
    roles.push(userRole.role.name);
    for (const rolePermission of userRole.role.permissions) {
      permissionKeys.add(rolePermission.permission.key);
    }
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    roles,
    permissions: Array.from(permissionKeys),
  };
}
