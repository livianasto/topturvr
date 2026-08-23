import { prisma } from "@/shared/db/prisma";
import type { ReservationStatus } from "@prisma/client";

const withRelations = {
  customer: true,
  item: { include: { supplier: true } },
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
    include: { ...withRelations, passengers: true },
  });
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
    include: { ...withRelations, passengers: true },
  });
}

export function listReservationsBySupplier(supplierId: string) {
  return prisma.reservation.findMany({
    where: { archivedAt: null, item: { supplierId } },
    include: withRelations,
    orderBy: { departureAt: "desc" },
  });
}

export function listReservationsByCustomer(customerId: string, year?: number) {
  const dateFilter = year
    ? {
        departureAt: {
          gte: new Date(Date.UTC(year, 0, 1)),
          lt: new Date(Date.UTC(year + 1, 0, 1)),
        },
      }
    : {};

  return prisma.reservation.findMany({
    where: { archivedAt: null, customerId, ...dateFilter },
    include: withRelations,
    orderBy: { departureAt: "desc" },
  });
}

export function listAllReservationsWithRelations(year?: number) {
  const dateFilter = year
    ? {
        departureAt: {
          gte: new Date(Date.UTC(year, 0, 1)),
          lt: new Date(Date.UTC(year + 1, 0, 1)),
        },
      }
    : {};

  return prisma.reservation.findMany({
    where: { archivedAt: null, ...dateFilter },
    include: withRelations,
  });
}

export type ReservationStatusValue = ReservationStatus;
