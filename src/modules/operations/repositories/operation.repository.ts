import { prisma } from "@/shared/db/prisma";

export async function createOperationForTrip(tripId: string) {
  return prisma.operation.create({ data: { tripId } });
}

export async function findOperationByTripId(tripId: string) {
  return prisma.operation.findUnique({ where: { tripId } });
}
