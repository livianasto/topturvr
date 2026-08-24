import { describe, expect, it, vi, beforeEach } from "vitest";

const findManyMock = vi.fn();

vi.mock("@/shared/db/prisma", () => ({
  prisma: { reservation: { findMany: (...args: unknown[]) => findManyMock(...args) } },
}));

describe("escopo dos relatorios", () => {
  beforeEach(() => {
    findManyMock.mockReset();
    findManyMock.mockResolvedValue([]);
  });

  it("exclui reservas canceladas e arquivadas dos totais gerais", async () => {
    const { listAllReservationsWithRelations } = await import("./reservation.repository");
    await listAllReservationsWithRelations();

    const where = findManyMock.mock.calls[0]?.[0]?.where;
    expect(where.archivedAt).toBeNull();
    expect(where.status).toEqual({ not: "CANCELLED" });
  });

  it("exclui canceladas tambem no relatorio por fornecedor", async () => {
    const { listReservationsBySupplier } = await import("./reservation.repository");
    await listReservationsBySupplier("supplier-1");

    const where = findManyMock.mock.calls[0]?.[0]?.where;
    expect(where.status).toEqual({ not: "CANCELLED" });
    expect(where.item).toEqual({ supplierId: "supplier-1" });
  });

  it("exclui canceladas e filtra por ano no relatorio por cliente", async () => {
    const { listReservationsByCustomer } = await import("./reservation.repository");
    await listReservationsByCustomer("customer-1", 2026);

    const where = findManyMock.mock.calls[0]?.[0]?.where;
    expect(where.status).toEqual({ not: "CANCELLED" });
    expect(where.customerId).toBe("customer-1");
    expect(where.departureAt.gte).toEqual(new Date(Date.UTC(2026, 0, 1)));
    expect(where.departureAt.lt).toEqual(new Date(Date.UTC(2027, 0, 1)));
  });

  it("a listagem geral de reservas continua mostrando as canceladas", async () => {
    const { listReservations } = await import("./reservation.repository");
    await listReservations();

    const where = findManyMock.mock.calls[0]?.[0]?.where;
    expect(where.archivedAt).toBeNull();
    expect(where.status).toBeUndefined();
  });
});
