import { prisma } from "@/shared/db/prisma";
import type { ReservationStatus } from "@prisma/client";

const withRelations = {
  customer: true,
  item: { include: { supplier: true } },
} as const;

/**
 * Passageiros sempre na ordem de cadastro. Sem o orderBy explicito o
 * Postgres devolve em ordem arbitraria, e a lista "pula" na tela depois
 * de editar um passageiro.
 */
const withPassengers = {
  ...withRelations,
  passengers: { orderBy: { createdAt: "asc" } },
} as const;

export function createReservation(data: {
  customerId: string;
  itemId: string;
  departureAt: Date;
  returnAt: Date;
  destinationCity: string;
  destinationState: string;
  tourStops?: string;
  purchaseAmountCents: number;
  saleAmountCents: number;
  marginCents: number;
  responsibleName: string;
  responsiblePhone?: string;
  customerNotes?: string;
  supplierNotes?: string;
  createdBy?: string;
}) {
  return prisma.reservation.create({
    data,
    include: withPassengers,
  });
}

export function updateReservation(
  id: string,
  data: {
    departureAt?: Date;
    returnAt?: Date;
    destinationCity?: string;
    destinationState?: string;
    tourStops?: string | null;
    purchaseAmountCents?: number;
    saleAmountCents?: number;
    marginCents?: number;
    responsibleName?: string;
    responsiblePhone?: string | null;
    customerNotes?: string | null;
    supplierNotes?: string | null;
  },
) {
  return prisma.reservation.update({
    where: { id },
    data,
    include: withPassengers,
  });
}

export function updateReservationStatus(id: string, status: ReservationStatus) {
  return prisma.reservation.update({ where: { id }, data: { status } });
}

export function updatePassenger(
  passengerId: string,
  data: {
    fullName?: string;
    cpf?: string | null;
    rg?: string | null;
    birthDate?: Date | null;
    phone?: string | null;
  },
) {
  return prisma.reservationPassenger.update({ where: { id: passengerId }, data });
}

export function removePassenger(passengerId: string) {
  return prisma.reservationPassenger.delete({ where: { id: passengerId } });
}

export function findPassengerById(passengerId: string) {
  return prisma.reservationPassenger.findUnique({ where: { id: passengerId } });
}

export function addPassenger(data: {
  reservationId: string;
  fullName: string;
  cpf?: string;
  rg?: string;
  birthDate?: Date;
  phone?: string;
}) {
  return prisma.reservationPassenger.create({ data });
}

export function listReservations() {
  return prisma.reservation.findMany({
    where: { archivedAt: null },
    include: withRelations,
    orderBy: { departureAt: "desc" },
  });
}

export function findReservationById(id: string) {
  return prisma.reservation.findUnique({
    where: { id },
    include: withPassengers,
  });
}

/**
 * Reservas canceladas ficam FORA dos relatorios: venda cancelada nao
 * pode inflar faturamento nem margem. O registro continua existindo
 * (voucher preservado) e aparece na listagem geral de reservas.
 */
const reportScope = { archivedAt: null, status: { not: "CANCELLED" as const } };

function yearFilter(year?: number) {
  if (!year) return {};
  return {
    departureAt: {
      gte: new Date(Date.UTC(year, 0, 1)),
      lt: new Date(Date.UTC(year + 1, 0, 1)),
    },
  };
}

export function listReservationsBySupplier(supplierId: string) {
  return prisma.reservation.findMany({
    where: { ...reportScope, item: { supplierId } },
    include: withRelations,
    orderBy: { departureAt: "desc" },
  });
}

export function listReservationsByCustomer(customerId: string, year?: number) {
  return prisma.reservation.findMany({
    where: { ...reportScope, customerId, ...yearFilter(year) },
    include: withRelations,
    orderBy: { departureAt: "desc" },
  });
}

export function listAllReservationsWithRelations(year?: number) {
  return prisma.reservation.findMany({
    where: { ...reportScope, ...yearFilter(year) },
    include: withRelations,
  });
}

export type ReservationStatusValue = ReservationStatus;
