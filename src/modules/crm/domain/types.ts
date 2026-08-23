export type CustomerStatus = "ACTIVE" | "INACTIVE";

export interface CustomerSummary {
  id: string;
  name: string;
  document: string | null;
  email: string | null;
  phone: string | null;
  status: CustomerStatus;
}
