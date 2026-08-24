import { prisma } from "@/shared/db/prisma";

export function createSupplier(data: {
  legalName: string;
  document?: string;
  category?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdBy?: string;
}) {
  return prisma.supplier.create({ data });
}

export function listSuppliers() {
  return prisma.supplier.findMany({
    where: { archivedAt: null },
    orderBy: { legalName: "asc" },
  });
}

export function findSupplierById(id: string) {
  return prisma.supplier.findUnique({ where: { id } });
}

export function updateSupplier(
  id: string,
  data: {
    legalName?: string;
    document?: string | null;
    category?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
  },
) {
  return prisma.supplier.update({ where: { id }, data });
}

export function archiveSupplier(id: string) {
  return prisma.supplier.update({
    where: { id },
    data: { archivedAt: new Date() },
  });
}
