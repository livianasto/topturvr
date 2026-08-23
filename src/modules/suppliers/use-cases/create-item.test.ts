import { describe, expect, it, vi, beforeEach } from "vitest";

const itemCreateMock = vi.fn();
const supplierFindUniqueMock = vi.fn();
const recordAuditEventMock = vi.fn();

vi.mock("@/shared/db/prisma", () => ({
  prisma: {
    item: { create: (...args: unknown[]) => itemCreateMock(...args) },
    supplier: { findUnique: (...args: unknown[]) => supplierFindUniqueMock(...args) },
  },
}));

vi.mock("@/modules/governance", () => ({
  recordAuditEvent: (...args: unknown[]) => recordAuditEventMock(...args),
}));

describe("createItemUseCase", () => {
  beforeEach(() => {
    itemCreateMock.mockReset();
    supplierFindUniqueMock.mockReset();
    recordAuditEventMock.mockReset();
  });

  it("cria o item quando o fornecedor existe e nao esta arquivado", async () => {
    supplierFindUniqueMock.mockResolvedValueOnce({ id: "supplier-1", archivedAt: null });
    itemCreateMock.mockResolvedValueOnce({
      id: "item-1",
      supplierId: "supplier-1",
      name: "Onibus 46 lugares",
      category: "VEHICLE",
      capacity: 46,
    });

    const { createItemUseCase } = await import("./create-item");
    const { PERMISSIONS } = await import("@/shared/rbac/permissions");

    const item = await createItemUseCase({
      actorId: "user-1",
      actorPermissions: [PERMISSIONS.ITEM_MANAGE],
      supplierId: "supplier-1",
      name: "Onibus 46 lugares",
      category: "VEHICLE",
      capacity: 46,
    });

    expect(item.id).toBe("item-1");
    expect(recordAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ action: "item.create", entityType: "Item" }),
    );
  });

  it("lanca SupplierNotFoundError quando o fornecedor nao existe", async () => {
    supplierFindUniqueMock.mockResolvedValueOnce(null);

    const { createItemUseCase, SupplierNotFoundError } = await import("./create-item");
    const { PERMISSIONS } = await import("@/shared/rbac/permissions");

    await expect(
      createItemUseCase({
        actorId: "user-1",
        actorPermissions: [PERMISSIONS.ITEM_MANAGE],
        supplierId: "supplier-inexistente",
        name: "Van",
        category: "VEHICLE",
      }),
    ).rejects.toThrow(SupplierNotFoundError);

    expect(itemCreateMock).not.toHaveBeenCalled();
  });

  it("lanca ForbiddenError quando falta permissao", async () => {
    const { createItemUseCase } = await import("./create-item");

    await expect(
      createItemUseCase({
        actorId: "user-1",
        actorPermissions: [],
        supplierId: "supplier-1",
        name: "Van",
        category: "VEHICLE",
      }),
    ).rejects.toThrow(/Acesso negado/);

    expect(supplierFindUniqueMock).not.toHaveBeenCalled();
  });
});
