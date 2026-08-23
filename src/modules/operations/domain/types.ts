/**
 * Stub minimo - ver comentario em prisma/schema.prisma sobre a decisao
 * Trip vs Operation. Modelagem completa fica para o ticket de modulo de
 * operacoes (docs/features/trip-operations.md).
 */
export type TripStatus =
  | "DRAFT"
  | "PLANNING"
  | "ON_SALE"
  | "CONFIRMED"
  | "READY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CLOSED"
  | "CANCELLED";

export type OperationStatus = "NOT_STARTED" | "IN_PROGRESS" | "READY" | "CLOSED";

export interface OperationSummary {
  id: string;
  tripId: string;
  status: OperationStatus;
  readinessScore: number | null;
}
