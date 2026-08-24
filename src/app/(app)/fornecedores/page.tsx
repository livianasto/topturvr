import Link from "next/link";
import { requireUser } from "@/shared/auth/session";
import {
  createSupplier,
  listSuppliers,
  archiveSupplier,
  updateSupplier,
} from "@/modules/suppliers";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";
import { revalidatePath } from "next/cache";

export default async function FornecedoresPage() {
  const user = await requireUser();
  const suppliers = await listSuppliers();

  async function createSupplierAction(formData: FormData) {
    "use server";
    const actor = await requireUser();

    await createSupplier({
      actorId: actor.id,
      actorPermissions: actor.permissions,
      legalName: String(formData.get("legalName")),
      document: formData.get("document")?.toString() || undefined,
      category: formData.get("category")?.toString() || undefined,
      contactEmail: formData.get("contactEmail")?.toString() || undefined,
      contactPhone: formData.get("contactPhone")?.toString() || undefined,
    });

    revalidatePath("/fornecedores");
  }

  async function updateSupplierAction(formData: FormData) {
    "use server";
    const actor = await requireUser();

    await updateSupplier({
      actorId: actor.id,
      actorPermissions: actor.permissions,
      supplierId: String(formData.get("supplierId")),
      legalName: String(formData.get("legalName")),
      document: formData.get("document")?.toString() || undefined,
      category: formData.get("category")?.toString() || undefined,
      contactEmail: formData.get("contactEmail")?.toString() || undefined,
      contactPhone: formData.get("contactPhone")?.toString() || undefined,
    });

    revalidatePath("/fornecedores");
  }

  async function archiveSupplierAction(formData: FormData) {
    "use server";
    const actor = await requireUser();

    await archiveSupplier({
      actorId: actor.id,
      actorPermissions: actor.permissions,
      supplierId: String(formData.get("supplierId")),
    });

    revalidatePath("/fornecedores");
  }

  return (
    <main className="mx-auto max-w-4xl p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Fornecedores</h1>
        <p className="text-sm text-slate-500">Logado como {user.email}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Novo fornecedor</h2>
        <form action={createSupplierAction} className="grid grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-2 col-span-2">
            <label htmlFor="legalName" className="text-sm font-medium">Razão social</label>
            <Input id="legalName" name="legalName" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="document" className="text-sm font-medium">Documento</label>
            <Input id="document" name="document" />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Categoria</label>
            <Input id="category" name="category" placeholder="ex: transporte, hotelaria" />
          </div>
          <div className="space-y-2">
            <label htmlFor="contactEmail" className="text-sm font-medium">E-mail de contato</label>
            <Input id="contactEmail" name="contactEmail" type="email" />
          </div>
          <div className="space-y-2">
            <label htmlFor="contactPhone" className="text-sm font-medium">Telefone de contato</label>
            <Input id="contactPhone" name="contactPhone" />
          </div>
          <div className="col-span-2">
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Todos os fornecedores ({suppliers.length})</h2>

        {suppliers.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum fornecedor cadastrado.</p>
        ) : (
          <ul className="space-y-2">
            {suppliers.map((supplier) => (
              <li key={supplier.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm">
                    <Link
                      href={`/fornecedores/${supplier.id}/itens`}
                      className="font-medium underline"
                    >
                      {supplier.legalName}
                    </Link>
                    <span className="text-slate-500">
                      {" "}
                      · {supplier.category ?? "sem categoria"} ·{" "}
                      {supplier.contactEmail ?? "sem e-mail"} ·{" "}
                      {supplier.contactPhone ?? "sem telefone"}
                    </span>
                  </div>
                  <form action={archiveSupplierAction}>
                    <input type="hidden" name="supplierId" value={supplier.id} />
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
                    action={updateSupplierAction}
                    className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-5"
                  >
                    <input type="hidden" name="supplierId" value={supplier.id} />
                    <div className="col-span-2 space-y-1 md:col-span-1">
                      <label className="text-xs font-medium">Razão social</label>
                      <Input name="legalName" defaultValue={supplier.legalName} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Documento</label>
                      <Input name="document" defaultValue={supplier.document ?? ""} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Categoria</label>
                      <Input name="category" defaultValue={supplier.category ?? ""} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">E-mail</label>
                      <Input
                        name="contactEmail"
                        type="email"
                        defaultValue={supplier.contactEmail ?? ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Telefone</label>
                      <Input name="contactPhone" defaultValue={supplier.contactPhone ?? ""} />
                    </div>
                    <div className="col-span-2 md:col-span-5">
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
