import { describe, expect, it, vi, beforeEach } from "vitest";

const findUniqueMock = vi.fn();
const updateMock = vi.fn();
const recordAuditEventMock = vi.fn();

vi.mock("@/shared/db/prisma", () => ({
  prisma: {
    reservation: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
      update: (...args: unknown[]) => updateMock(...args),
    },
  },
}));

vi.mock("@/modules/governance", () => ({
  recordAuditEvent: (...args: unknown[]) => recordAuditEventMock(...args),
}));

async function callWith(currentStatus: string, target: "CONFIRMED" | "CANCELLED") {
  findUniqueMock.mockResolvedValueOnce({ id: "r1", status: currentStatus });
  updateMock.mockResolvedValueOnce({ id: "r1", status: target });

  const { changeReservationStatusUseCase } = await import("./change-reservation-status");
  const { PERMISSIONS } = await import("@/shared/rbac/permissions");

  return changeReservationStatusUseCase({
    actorId: "user-1",
    actorPermissions: [PERMISSIONS.RESERVATION_MANAGE],
    reservationId: "r1",
    status: target,
  });
}

describe("changeReservationStatusUseCase", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
    updateMock.mockReset();
    recordAuditEventMock.mockReset();
  });

  it("confirma uma reserva pendente", async () => {
    const result = await callWith("PENDING", "CONFIRMED");

    expect(result.status).toBe("CONFIRMED");
    expect(recordAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ action: "reservation.confirmed" }),
    );
  });

  it("cancela uma reserva pendente", async () => {
    const result = await callWith("PENDING", "CANCELLED");
    expect(result.status).toBe("CANCELLED");
  });

  it("cancela uma reserva ja confirmada", async () => {
    const result = await callWith("CONFIRMED", "CANCELLED");
    expect(result.status).toBe("CANCELLED");
  });

  it("recusa reconfirmar uma reserva cancelada", async () => {
    findUniqueMock.mockResolvedValueOnce({ id: "r1", status: "CANCELLED" });

    const { changeReservationStatusUseCase, InvalidStatusTransitionError } = await import(
      "./change-reservation-status"
    );
    const { PERMISSIONS } = await import("@/shared/rbac/permissions");

    await expect(
      changeReservationStatusUseCase({
        actorId: "user-1",
        actorPermissions: [PERMISSIONS.RESERVATION_MANAGE],
        reservationId: "r1",
        status: "CONFIRMED",
      }),
    ).rejects.toThrow(InvalidStatusTransitionError);

    expect(updateMock).not.toHaveBeenCalled();
  });

  it("lanca ForbiddenError sem permissao", async () => {
    const { changeReservationStatusUseCase } = await import("./change-reservation-status");

    await expect(
      changeReservationStatusUseCase({
        actorId: "user-1",
        actorPermissions: [],
        reservationId: "r1",
        status: "CANCELLED",
      }),
    ).rejects.toThrow(/Acesso negado/);

    expect(findUniqueMock).not.toHaveBeenCalled();
  });
});
