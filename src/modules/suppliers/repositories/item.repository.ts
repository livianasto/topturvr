import { prisma } from "@/shared/db/prisma";
import type { ItemCategory } from "@prisma/client";

export function createItem(data: {
  supplierId: string;
  name: string;
  category: ItemCategory;
  capacity?: number;
  description?: string;
  createdBy?: string;
}) {
  return prisma.item.create({ data });
}

export function listItemsBySupplier(supplierId: string) {
  return prisma.item.findMany({
    where: { supplierId, archivedAt: null },
    orderBy: { name: "asc" },
  });
}

export function listAllItemsWithSupplier() {
  return prisma.item.findMany({
    where: { archivedAt: null, supplier: { archivedAt: null } },
    include: { supplier: true },
    orderBy: { name: "asc" },
  });
}

export function findItemById(id: string) {
  return prisma.item.findUnique({ where: { id } });
}

export function updateItem(
  id: string,
  data: {
    name?: string;
    category?: ItemCategory;
    capacity?: number | null;
    description?: string | null;
  },
) {
  return prisma.item.update({ where: { id }, data });
}

export function archiveItem(id: string) {
  return prisma.item.update({
    where: { id },
    data: { archivedAt: new Date() },
  });
}
