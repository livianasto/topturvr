import { z } from "zod";
import { uuidSchema, isoDateTimeSchema, amountCentsSchema } from "@/shared/validation/common-schemas";

export const createReservationSchema = z.object({
  customerId: uuidSchema,
  itemId: uuidSchema,
  departureAt: isoDateTimeSchema,
  returnAt: isoDateTimeSchema,
  destinationCity: z.string().min(1),
  destinationState: z.string().length(2),
  tourStops: z.string().optional(),
  purchaseAmountCents: amountCentsSchema.nonnegative(),
  saleAmountCents: amountCentsSchema.nonnegative(),
  responsibleName: z.string().min(1),
  responsiblePhone: z.string().optional(),
  customerNotes: z.string().optional(),
  supplierNotes: z.string().optional(),
});

export type CreateReservationFields = z.infer<typeof createReservationSchema>;

export const addPassengerSchema = z.object({
  reservationId: uuidSchema,
  fullName: z.string().min(1),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  birthDate: z.string().optional(),
  phone: z.string().optional(),
});

export type AddPassengerFields = z.infer<typeof addPassengerSchema>;
