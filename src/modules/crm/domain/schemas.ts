import { z } from "zod";
import { uuidSchema } from "@/shared/validation/common-schemas";

export const createCustomerSchema = z.object({
  name: z.string().min(1),
  document: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export type CreateCustomerFields = z.infer<typeof createCustomerSchema>;

export const archiveCustomerSchema = z.object({
  customerId: uuidSchema,
});
