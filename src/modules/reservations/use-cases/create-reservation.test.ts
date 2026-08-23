import { describe, expect, it, vi, beforeEach } from "vitest";

const reservationCreateMock = vi.fn();
const recordAuditEventMock = vi.fn();
const getCustomerByIdMock = vi.fn();
const getItemByIdMock = vi.fn();

vi.mock("@/shared/db/prisma", () => ({
  prisma: { reservation: { create: (...args: unknown[]) => reservationCreateMock(...args) } },
}));

vi.mock("@/modules/governance", () => ({
  recordAuditEvent: (...args: unknown[]) => recordAuditEventMock(...args),
}));

vi.mock("@/modules/crm", () => ({
  getCustomerById: (...args: unknown[]) => getCustomerByIdMock(...args),
}));

vi.mock("@/modules/suppliers", () => ({
  getItemById: (...args: unknown[]) => getItemByIdMock(...args),
}));

const basePayload = {
  actorId: "user-1",
  customerId: "customer-1",
  itemId: "item-1",
  departureAt: "2026-09-04T10:00:00.000Z",
  returnAt: "2026-09-04T22:00:00.000Z",
  destinationCity: "Rio de Janeiro",
  destinationState: "rj",
  purchaseAmountCents: 100000,
  saleAmountCents: 150000,
  responsibleName: "Maria Silva",
};

describe("createReservationUseCase", () => {
  beforeEach(() => {
    reservationCreateMock.mockReset();
    recordAuditEventMock.mockReset();
    getCustomerByIdMock.mockReset();
    getItemByIdMock.mockReset();
  });

  it("calcula a margem corretamente e cria a reserva quando cliente e item existem", async () => {
    getCustomerByIdMock.mockResolvedValueOnce({ id: "customer-1" });
    getItemByIdMock.mockResolvedValueOnce({ id: "item-1" });
    reservationCreateMock.mockImplementationOnce(async ({ data }: { data: Record<string, unknown> }) => ({
      id: "reservation-1",
      voucherNumber: 1,
      ...data,
    }));

    const { createReservationUseCase } = await import("./create-reservation");
    const { PERMISSIONS } = await import("@/shared/rbac/permissions");

    const reservation = await createReservationUseCase({
      ...basePayload,
      actorPermissions: [PERMISSIONS.RESERVATION_MANAGE],
    });

    expect(reservation.marginCents).toBe(50000);
    expect(reservation.destinationState).toBe("RJ");
    expect(recordAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ action: "reservation.create", entityType: "Reservation" }),
    );
  });

  it("lanca CustomerNotFoundError quando o cliente nao existe", async () => {
    getCustomerByIdMock.mockResolvedValueOnce(null);

    const { createReservationUseCase, CustomerNotFoundError } = await import("./create-reservation");
    const { PERMISSIONS } = await import("@/shared/rbac/permissions");

    await expect(
      createReservationUseCase({ ...basePayload, actorPermissions: [PERMISSIONS.RESERVATION_MANAGE] }),
    ).rejects.toThrow(CustomerNotFoundError);

    expect(reservationCreateMock).not.toHaveBeenCalled();
  });

  it("lanca ForbiddenError quando falta permissao", async () => {
    const { createReservationUseCase } = await import("./create-reservation");

    await expect(
      createReservationUseCase({ ...basePayload, actorPermissions: [] }),
    ).rejects.toThrow(/Acesso negado/);

    expect(getCustomerByIdMock).not.toHaveBeenCalled();
  });
});
