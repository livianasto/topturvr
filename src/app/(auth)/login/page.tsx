import { signIn } from "@/shared/auth/auth";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";

export default function LoginPage() {
  async function login(formData: FormData) {
    "use server";
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <form action={login} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Entrar - Toptur Operations</h1>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Senha
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </main>
  );
}
