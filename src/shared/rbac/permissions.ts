/**
 * Lista canonica de permissoes do sistema.
 *
 * Chaves seguem o padrao "recurso:acao". O seed (prisma/seed.ts) cria uma
 * linha Permission para cada chave abaixo e vincula aos papeis iniciais.
 */
export const PERMISSIONS = {
  TRIP_APPROVE_EXCEPTION: "trip:approve_exception",
  TRIP_REOPEN_CLOSED: "trip:reopen_closed",
  TRIP_MANAGE: "trip:manage",
  ROLE_ASSIGN: "role:assign",
  USER_MANAGE: "user:manage",
  FINANCE_VIEW: "finance:view",
  FINANCE_MANAGE: "finance:manage",
  CUSTOMER_MANAGE: "customer:manage",
  SUPPLIER_MANAGE: "supplier:manage",
  ITEM_MANAGE: "item:manage",
  RESERVATION_MANAGE: "reservation:manage",
  TECHNICAL_MANAGE_SECRETS: "technical:manage_secrets",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: PermissionKey[] = Object.values(PERMISSIONS);

/**
 * Papeis iniciais do MVP (PRODUCT.md secao 4).
 *
 * - direcao_geral (Rogerio): tudo, incluindo excecoes reservadas a direcao
 *   (BR-GOV-002: cancelar iniciativa, reabrir viagem fechada, aprovar
 *   excecao critica).
 * - gestao_operacao (Livia): administra a operacao no dia a dia, mas nao
 *   acessa segredos tecnicos (docs/features/identity-access.md).
 */
export const ROLE_PERMISSIONS: Record<string, PermissionKey[]> = {
  direcao_geral: ALL_PERMISSIONS,
  gestao_operacao: ALL_PERMISSIONS.filter(
    (key) => key !== PERMISSIONS.TECHNICAL_MANAGE_SECRETS,
  ),
};
