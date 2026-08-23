import { describe, expect, it, vi, beforeEach } from "vitest";

const createMock = vi.fn();
const recordAuditEventMock = vi.fn();

vi.mock("@/shared/db/prisma", () => ({
  prisma: { customer: { create: (...args: unknown[]) => createMock(...args) } },
}));

vi.mock("@/modules/governance", () => ({
  recordAuditEvent: (...args: unknown[]) => recordAuditEventMock(...args),
}));

describe("createCustomerUseCase", () => {
  beforeEach(() => {
    createMock.mockReset();
    recordAuditEventMock.mockReset();
  });

  it("cria o cliente e registra auditoria quando o ator tem permissao", async () => {
    createMock.mockResolvedValueOnce({
      id: "customer-1",
      name: "Escola ABC",
      document: null,
      email: null,
      phone: null,
    });

    const { createCustomerUseCase } = await import("./create-customer");
    const { PERMISSIONS } = await import("@/shared/rbac/permissions");

    const result = await createCustomerUseCase({
      actorId: "user-1",
      actorPermissions: [PERMISSIONS.CUSTOMER_MANAGE],
      name: "Escola ABC",
    });

    expect(result.id).toBe("customer-1");
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(recordAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ actorId: "user-1", action: "customer.create", entityType: "Customer" }),
    );
  });

  it("lanca ForbiddenError e nao chama o banco quando falta permissao", async () => {
    const { createCustomerUseCase } = await import("./create-customer");

    await expect(
      createCustomerUseCase({
        actorId: "user-1",
        actorPermissions: [],
        name: "Escola ABC",
      }),
    ).rejects.toThrow(/Acesso negado/);

    expect(createMock).not.toHaveBeenCalled();
    expect(recordAuditEventMock).not.toHaveBeenCalled();
  });
});
