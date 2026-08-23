import type { PermissionKey } from "./permissions";

/**
 * Checagem pura de permissao, sem acesso a banco - usada quando as
 * permissoes ja foram resolvidas (ex: anexadas a sessao no login).
 * Nao importa nada que dependa de env/banco, para ser testavel de forma
 * isolada (ver can.test.ts).
 */
export function canSync(permissions: string[], key: PermissionKey): boolean {
  return permissions.includes(key);
}
