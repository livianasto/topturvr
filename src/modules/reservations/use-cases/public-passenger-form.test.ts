import { describe, expect, it, vi, beforeEach } from "vitest";

const reservationFindUniqueMock = vi.fn();
const passengerCreateMock = vi.fn();
const recordAuditEventMock = vi.fn();

vi.mock("@/shared/db/prisma", () => ({
  prisma: {
    reservation: { findUnique: (...args: unknown[]) => reservationFindUniqueMock(...args) },
    reservationPassenger: { create: (...args: unknown[]) => passengerCreateMock(...args) },
  },
}));

vi.mock("@/modules/governance", () => ({
  recordAuditEvent: (...args: unknown[]) => recordAuditEventMock(...args),
}));

const baseInput = { token: "token-secreto", fullName: "Joao da Silva" };

describe("addPassengerPublicly", () => {
  beforeEach(() => {
    reservationFindUniqueMock.mockReset();
    passengerCreateMock.mockReset();
    recordAuditEventMock.mockReset();
  });

  it("adiciona o passageiro quando o token e valido e ha vaga", async () => {
    reservationFindUniqueMock.mockResolvedValueOnce({
      id: "reservation-1",
      archivedAt: null,
      status: "PENDING",
      item: { capacity: 46 },
      _count: { passengers: 10 },
    });
    passengerCreateMock.mockResolvedValueOnce({ id: "passenger-1" });

    const { addPassengerPublicly } = await import("./public-passenger-form");
    const passenger = await addPassengerPublicly(baseInput);

    expect(passenger.id).toBe("passenger-1");
    expect(recordAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        actorId: null,
        action: "reservation_passenger.create.public",
      }),
    );
  });

  it("recusa token inexistente", async () => {
    reservationFindUniqueMock.mockResolvedValueOnce(null);

    const { addPassengerPublicly, InvalidPublicTokenError } = await import(
      "./public-passenger-form"
    );

    await expect(addPassengerPublicly(baseInput)).rejects.toThrow(InvalidPublicTokenError);
    expect(passengerCreateMock).not.toHaveBeenCalled();
  });

  it("recusa reserva arquivada", async () => {
    reservationFindUniqueMock.mockResolvedValueOnce({
      id: "reservation-1",
      archivedAt: new Date(),
      status: "PENDING",
      item: { capacity: 46 },
      _count: { passengers: 0 },
    });

    const { addPassengerPublicly, InvalidPublicTokenError } = await import(
      "./public-passenger-form"
    );

    await expect(addPassengerPublicly(baseInput)).rejects.toThrow(InvalidPublicTokenError);
    expect(passengerCreateMock).not.toHaveBeenCalled();
  });

  it("recusa reserva cancelada", async () => {
    reservationFindUniqueMock.mockResolvedValueOnce({
      id: "reservation-1",
      archivedAt: null,
      status: "CANCELLED",
      item: { capacity: 46 },
      _count: { passengers: 0 },
    });

    const { addPassengerPublicly, ReservationClosedError } = await import(
      "./public-passenger-form"
    );

    await expect(addPassengerPublicly(baseInput)).rejects.toThrow(ReservationClosedError);
    expect(passengerCreateMock).not.toHaveBeenCalled();
  });

  it("recusa quando a capacidade do veiculo ja foi atingida", async () => {
    reservationFindUniqueMock.mockResolvedValueOnce({
      id: "reservation-1",
      archivedAt: null,
      status: "PENDING",
      item: { capacity: 46 },
      _count: { passengers: 46 },
    });

    const { addPassengerPublicly, ReservationFullError } = await import(
      "./public-passenger-form"
    );

    await expect(addPassengerPublicly(baseInput)).rejects.toThrow(ReservationFullError);
    expect(passengerCreateMock).not.toHaveBeenCalled();
  });

  it("permite adicionar quando o item nao tem capacidade definida", async () => {
    reservationFindUniqueMock.mockResolvedValueOnce({
      id: "reservation-1",
      archivedAt: null,
      status: "PENDING",
      item: { capacity: null },
      _count: { passengers: 999 },
    });
    passengerCreateMock.mockResolvedValueOnce({ id: "passenger-2" });

    const { addPassengerPublicly } = await import("./public-passenger-form");

    await expect(addPassengerPublicly(baseInput)).resolves.toMatchObject({
      id: "passenger-2",
    });
  });
});

describe("getPublicReservation", () => {
  beforeEach(() => {
    reservationFindUniqueMock.mockReset();
  });

  it("nunca expoe valores, margem ou dados sensiveis dos passageiros", async () => {
    reservationFindUniqueMock.mockResolvedValueOnce({
      voucherNumber: 1,
      archivedAt: null,
      status: "PENDING",
      departureAt: new Date("2026-09-04T11:00:00.000Z"),
      returnAt: new Date("2026-09-05T05:00:00.000Z"),
      destinationCity: "Rio de Janeiro",
      destinationState: "RJ",
      tourStops: "Cidade do Rock",
      responsibleName: "Maria Souza",
      customer: { name: "Escola ABC" },
      item: { name: "Onibus", capacity: 46 },
      passengers: [{ id: "p1", fullName: "Joao da Silva" }],
    });

    const { getPublicReservation } = await import("./public-passenger-form");
    const result = await getPublicReservation("token-secreto");

    expect(result).not.toBeNull();
    const keys = Object.keys(result!);
    expect(keys).not.toContain("saleAmountCents");
    expect(keys).not.toContain("purchaseAmountCents");
    expect(keys).not.toContain("marginCents");
    // Passageiros saem apenas como lista de nomes.
    expect(result!.passengerNames).toEqual(["Joao da Silva"]);
  });

  it("retorna null para reserva arquivada", async () => {
    reservationFindUniqueMock.mockResolvedValueOnce({
      archivedAt: new Date(),
      customer: { name: "x" },
      item: { name: "x", capacity: null },
      passengers: [],
    });

    const { getPublicReservation } = await import("./public-passenger-form");

    await expect(getPublicReservation("token-secreto")).resolves.toBeNull();
  });
});
