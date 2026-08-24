import { describe, expect, it, vi, beforeEach } from "vitest";

const findUniqueMock = vi.fn();
const updateMock = vi.fn();
const recordAuditEventMock = vi.fn();

vi.mock("@/shared/db/prisma", () => ({
  prisma: {
    customer: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
      update: (...args: unknown[]) => updateMock(...args),
    },
  },
}));

vi.mock("@/modules/governance", () => ({
  recordAuditEvent: (...args: unknown[]) => recordAuditEventMock(...args),
}));

describe("updateCustomerUseCase", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
    updateMock.mockReset();
    recordAuditEventMock.mockReset();
  });

  it("atualiza e registra auditoria com o antes e o depois", async () => {
    findUniqueMock.mockResolvedValueOnce({
      id: "c1",
      name: "Escola ABC",
      document: null,
      email: null,
      phone: "24 9999-0000",
    });
    updateMock.mockResolvedValueOnce({
      id: "c1",
      name: "Escola ABC Ltda",
      document: "12.345.678/0001-90",
      email: "contato@abc.local",
      phone: "24 9999-0000",
    });

    const { updateCustomerUseCase } = await import("./update-customer");
    const { PERMISSIONS } = await import("@/shared/rbac/permissions");

    const result = await updateCustomerUseCase({
      actorId: "user-1",
      actorPermissions: [PERMISSIONS.CUSTOMER_MANAGE],
      customerId: "c1",
      name: "Escola ABC Ltda",
      document: "12.345.678/0001-90",
      email: "contato@abc.local",
      phone: "24 9999-0000",
    });

    expect(result.name).toBe("Escola ABC Ltda");
    expect(recordAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "customer.update",
        entityType: "Customer",
        before: expect.objectContaining({ name: "Escola ABC" }),
        after: expect.objectContaining({ name: "Escola ABC Ltda" }),
      }),
    );
  });

  it("limpa campos opcionais deixados em branco", async () => {
    findUniqueMock.mockResolvedValueOnce({
      id: "c1",
      name: "Escola ABC",
      document: "123",
      email: "a@b.local",
      phone: "24 9999-0000",
    });
    updateMock.mockResolvedValueOnce({
      id: "c1",
      name: "Escola ABC",
      document: null,
      email: null,
      phone: null,
    });

    const { updateCustomerUseCase } = await import("./update-customer");
    const { PERMISSIONS } = await import("@/shared/rbac/permissions");

    await updateCustomerUseCase({
      actorId: "user-1",
      actorPermissions: [PERMISSIONS.CUSTOMER_MANAGE],
      customerId: "c1",
      name: "Escola ABC",
    });

    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { name: "Escola ABC", document: null, email: null, phone: null },
      }),
    );
  });

  it("recusa cliente inexistente", async () => {
    findUniqueMock.mockResolvedValueOnce(null);

    const { updateCustomerUseCase, CustomerNotFoundError } = await import("./update-customer");
    const { PERMISSIONS } = await import("@/shared/rbac/permissions");

    await expect(
      updateCustomerUseCase({
        actorId: "user-1",
        actorPermissions: [PERMISSIONS.CUSTOMER_MANAGE],
        customerId: "inexistente",
        name: "X",
      }),
    ).rejects.toThrow(CustomerNotFoundError);

    expect(updateMock).not.toHaveBeenCalled();
  });

  it("lanca ForbiddenError sem permissao", async () => {
    const { updateCustomerUseCase } = await import("./update-customer");

    await expect(
      updateCustomerUseCase({
        actorId: "user-1",
        actorPermissions: [],
        customerId: "c1",
        name: "X",
      }),
    ).rejects.toThrow(/Acesso negado/);

    expect(findUniqueMock).not.toHaveBeenCalled();
  });
});
