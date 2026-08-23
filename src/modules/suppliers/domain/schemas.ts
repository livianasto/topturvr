import { z } from "zod";
import { uuidSchema } from "@/shared/validation/common-schemas";

export const createSupplierSchema = z.object({
  legalName: z.string().min(1),
  document: z.string().optional(),
  category: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
});

export const archiveSupplierSchema = z.object({
  supplierId: uuidSchema,
});

export const itemCategorySchema = z.enum(["VEHICLE", "HOTEL", "INSURANCE", "OTHER"]);

export const createItemSchema = z.object({
  supplierId: uuidSchema,
  name: z.string().min(1),
  category: itemCategorySchema.default("OTHER"),
  capacity: z.coerce.number().int().positive().optional(),
  description: z.string().optional(),
});

export const archiveItemSchema = z.object({
  itemId: uuidSchema,
});
