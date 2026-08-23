import { prisma } from "@/shared/db/prisma";
import { addPassenger } from "../repositories/reservation.repository";
import { recordAuditEvent } from "@/modules/governance";

/**
 * Autopreenchimento de passageiros pelo proprio cliente, via link publico
 * (/p/<token>). NAO exige login: a autorizacao vem de possuir o token
 * secreto da reserva.
 *
 * Por isso o escopo aqui e deliberadamente minimo - so permite adicionar
 * passageiros a uma reserva especifica, nunca ler valores, margem, dados
 * de outras reservas ou qualquer outra coisa. Os eventos de auditoria
 * ficam com actorId nulo e acao "*.public" para distinguir do que a
 * equipe interna faz.
 */

export class InvalidPublicTokenError extends Error {
  constructor() {
    super("Link invalido ou expirado.");
    this.name = "InvalidPublicTokenError";
  }
}

export class ReservationFullError extends Error {
  constructor(capacity: number) {
    super(`Lista cheia: o servico comporta ${capacity} passageiros.`);
    this.name = "ReservationFullError";
  }
}

export class ReservationClosedError extends Error {
  constructor() {
    super("Esta reserva nao esta mais aceitando passageiros.");
    this.name = "ReservationClosedError";
  }
}

/** Dados minimos e nao sensiveis exibidos na pagina publica. */
export async function getPublicReservation(token: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { publicToken: token },
    include: {
      customer: { select: { name: true } },
      item: { select: { name: true, capacity: true } },
      passengers: { select: { id: true, fullName: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!reservation || reservation.archivedAt) {
    return null;
  }

  return {
    voucherNumber: reservation.voucherNumber,
    customerName: reservation.customer.name,
    itemName: reservation.item.name,
    capacity: reservation.item.capacity,
    departureAt: reservation.departureAt,
    returnAt: reservation.returnAt,
    destinationCity: reservation.destinationCity,
    destinationState: reservation.destinationState,
    tourStops: reservation.tourStops,
    responsibleName: reservation.responsibleName,
    status: reservation.status,
    // Apenas nomes - CPF, RG, nascimento e telefone dos demais
    // passageiros nunca sao expostos na pagina publica.
    passengerNames: reservation.passengers.map((passenger) => passenger.fullName),
  };
}

export interface AddPassengerPubliclyInput {
  token: string;
  fullName: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  phone?: string;
}

export async function addPassengerPublicly(input: AddPassengerPubliclyInput) {
  const reservation = await prisma.reservation.findUnique({
    where: { publicToken: input.token },
    include: {
      item: { select: { capacity: true } },
      _count: { select: { passengers: true } },
    },
  });

  if (!reservation || reservation.archivedAt) {
    throw new InvalidPublicTokenError();
  }

  if (reservation.status === "CANCELLED") {
    throw new ReservationClosedError();
  }

  const capacity = reservation.item.capacity;
  if (capacity !== null && reservation._count.passengers >= capacity) {
    throw new ReservationFullError(capacity);
  }

  const passenger = await addPassenger({
    reservationId: reservation.id,
    fullName: input.fullName,
    cpf: input.cpf,
    rg: input.rg,
    birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
    phone: input.phone,
  });

  await recordAuditEvent({
    actorId: null,
    action: "reservation_passenger.create.public",
    entityType: "ReservationPassenger",
    entityId: passenger.id,
    after: { reservationId: reservation.id, fullName: input.fullName },
  });

  return passenger;
}
