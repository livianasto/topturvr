import { describe, expect, it } from "vitest";
import { canSync } from "./can";
import { PERMISSIONS, ROLE_PERMISSIONS } from "./permissions";

describe("canSync", () => {
  it("retorna true quando a permissao esta na lista", () => {
    expect(canSync([PERMISSIONS.TRIP_MANAGE], PERMISSIONS.TRIP_MANAGE)).toBe(true);
  });

  it("retorna false quando a permissao nao esta na lista", () => {
    expect(canSync([PERMISSIONS.TRIP_MANAGE], PERMISSIONS.ROLE_ASSIGN)).toBe(false);
  });

  it("retorna false para lista vazia", () => {
    expect(canSync([], PERMISSIONS.TRIP_MANAGE)).toBe(false);
  });
});

describe("ROLE_PERMISSIONS", () => {
  it("gestao_operacao nunca inclui technical:manage_secrets", () => {
    expect(ROLE_PERMISSIONS.gestao_operacao).not.toContain(
      PERMISSIONS.TECHNICAL_MANAGE_SECRETS,
    );
  });

  it("direcao_geral inclui todas as permissoes, incluindo approve_exception", () => {
    expect(ROLE_PERMISSIONS.direcao_geral).toContain(PERMISSIONS.TRIP_APPROVE_EXCEPTION);
    expect(ROLE_PERMISSIONS.direcao_geral).toContain(PERMISSIONS.TECHNICAL_MANAGE_SECRETS);
  });
});
