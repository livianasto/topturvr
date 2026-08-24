import { requireUser } from "@/shared/auth/session";
import { createCustomer, listCustomers, archiveCustomer } from "@/modules/crm";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";
import { revalidatePath } from "next/cache";

export default async function ClientesPage() {
  const user = await requireUser();
  const customers = await listCustomers();

  async function createCustomerAction(formData: FormData) {
    "use server";
    const actor = await requireUser();

    await createCustomer({
      actorId: actor.id,
      actorPermissions: actor.permissions,
      name: String(formData.get("name")),
      document: formData.get("document")?.toString() || undefined,
      email: formData.get("email")?.toString() || undefined,
      phone: formData.get("phone")?.toString() || undefined,
    });

    revalidatePath("/clientes");
  }

  async function archiveCustomerAction(formData: FormData) {
    "use server";
    const actor = await requireUser();

    await archiveCustomer({
      actorId: actor.id,
      actorPermissions: actor.permissions,
      customerId: String(formData.get("customerId")),
    });

    revalidatePath("/clientes");
  }

  return (
    <main className="mx-auto max-w-4xl p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <p className="text-sm text-slate-500">Logado como {user.email}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Novo cliente</h2>
        <form action={createCustomerAction} className="grid grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-2 col-span-2">
            <label htmlFor="name" className="text-sm font-medium">Nome</label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="document" className="text-sm font-medium">Documento</label>
            <Input id="document" name="document" />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
            <Input id="phone" name="phone" />
          </div>
          <div className="space-y-2 col-span-2">
            <label htmlFor="email" className="text-sm font-medium">E-mail</label>
            <Input id="email" name="email" type="email" />
          </div>
          <div className="col-span-2">
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Todos os clientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-left">
                <th className="py-2 pr-4">Nome</th>
                <th className="py-2 pr-4">Documento</th>
                <th className="py-2 pr-4">E-mail</th>
                <th className="py-2 pr-4">Telefone</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-100">
                  <td className="py-2 pr-4">{customer.name}</td>
                  <td className="py-2 pr-4">{customer.document ?? "-"}</td>
                  <td className="py-2 pr-4">{customer.email ?? "-"}</td>
                  <td className="py-2 pr-4">{customer.phone ?? "-"}</td>
                  <td className="py-2 pr-4">{customer.status}</td>
                  <td className="py-2">
                    <form action={archiveCustomerAction}>
                      <input type="hidden" name="customerId" value={customer.id} />
                      <Button type="submit" variant="outline" size="sm">Arquivar</Button>
                    </form>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-500">
                    Nenhum cliente cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
