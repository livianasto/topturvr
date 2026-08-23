import bcrypt from "bcryptjs";
import { findUserByEmail } from "../repositories/user.repository";
import { getUserPermissions } from "./get-user-permissions";

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

/**
 * Valida credenciais de email/senha. Usado pelo Credentials provider do
 * Auth.js (shared/auth/auth.config.ts). Retorna null em qualquer falha,
 * sem detalhar o motivo (evita enumeracao de usuarios).
 */
export async function authenticateUser(input: AuthenticateUserInput) {
  const user = await findUserByEmail(input.email);
  if (!user || !user.passwordHash || user.status !== "ACTIVE") {
    return null;
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    return null;
  }

  return getUserPermissions(user.id);
}
