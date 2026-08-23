export interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  roles: string[];
  permissions: string[];
}
