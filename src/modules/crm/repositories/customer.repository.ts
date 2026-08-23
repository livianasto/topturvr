import { prisma } from "@/shared/db/prisma";

export function createCustomer(data: {
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  createdBy?: string;
}) {
  return prisma.customer.create({ data });
}

export function listCustomers() {
  return prisma.customer.findMany({
    where: { archivedAt: null },
    orderBy: { name: "asc" },
  });
}

export function findCustomerById(id: string) {
  return prisma.customer.findUnique({ where: { id } });
}

export function archiveCustomer(id: string) {
  return prisma.customer.update({
    where: { id },
    data: { archivedAt: new Date() },
  });
}
