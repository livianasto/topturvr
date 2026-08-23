import type { DefaultSession } from "@auth/core/types";

declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      roles: string[];
      permissions: string[];
    } & DefaultSession["user"];
  }

  interface User {
    roles: string[];
    permissions: string[];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    roles?: string[];
    permissions?: string[];
  }
}
