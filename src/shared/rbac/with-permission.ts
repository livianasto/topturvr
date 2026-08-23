import { canSync } from "./can";
import type { PermissionKey } from "./permissions";

export class ForbiddenError extends Error {
  constructor(permission: PermissionKey) {
    super(`Acesso negado: permissao ausente "${permission}".`);
    this.name = "ForbiddenError";
  }
}

/**
 * Guarda para uso no topo de use-cases/route handlers. Lanca ForbiddenError
 * se a sessao/permissoes fornecidas nao contiverem a permissao exigida.
 */
export function requirePermission(
  permissions: string[],
  key: PermissionKey,
): void {
  if (!canSync(permissions, key)) {
    throw new ForbiddenError(key);
  }
}
