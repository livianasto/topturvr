import { requireUser } from "@/shared/auth/session";
import {
  createCustomer,
  listCustomers,
  archiveCustomer,
  updateCustomer,
} from "@/modules/crm";
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

  async function updateCustomerAction(formData: FormData) {
    "use server";
    const actor = await requireUser();

    await updateCustomer({
      actorId: actor.id,
      actorPermissions: actor.permissions,
      customerId: String(formData.get("customerId")),
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
        <h2 className="text-lg font-medium">Todos os clientes ({customers.length})</h2>

        {customers.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum cliente cadastrado.</p>
        ) : (
          <ul className="space-y-2">
            {customers.map((customer) => (
              <li key={customer.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm">
                    <span className="font-medium">{customer.name}</span>
                    <span className="text-slate-500">
                      {" "}
                      · {customer.document ?? "sem documento"} · {customer.email ?? "sem e-mail"} ·{" "}
                      {customer.phone ?? "sem telefone"}
                    </span>
                  </div>
                  <form action={archiveCustomerAction}>
                    <input type="hidden" name="customerId" value={customer.id} />
                    <Button type="submit" variant="outline" size="sm">
                      Arquivar
                    </Button>
                  </form>
                </div>

                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-slate-600">
                    Editar dados
                  </summary>
                  <form
                    action={updateCustomerAction}
                    className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4"
                  >
                    <input type="hidden" name="customerId" value={customer.id} />
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Nome</label>
                      <Input name="name" defaultValue={customer.name} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Documento</label>
                      <Input name="document" defaultValue={customer.document ?? ""} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">E-mail</label>
                      <Input name="email" type="email" defaultValue={customer.email ?? ""} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Telefone</label>
                      <Input name="phone" defaultValue={customer.phone ?? ""} />
                    </div>
                    <div className="col-span-2 md:col-span-4">
                      <Button type="submit" size="sm">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
