import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Garante que ha um usuario logado. Sem sessao (expirada ou inexistente),
 * manda para o login em vez de lancar erro - antes isso derrubava a pagina
 * com um 500, e quem so tinha ficado tempo demais parado via uma tela de
 * erro em vez da tela de entrada.
 *
 * Uso restrito a Server Components e Server Actions, que e onde
 * redirect() funciona.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
