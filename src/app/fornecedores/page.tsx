import Link from "next/link";
import { requireUser } from "@/shared/auth/session";
import { createSupplier, listSuppliers, archiveSupplier } from "@/modules/suppliers";
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
        <h2 className="text-lg font-medium">Todos os fornecedores</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-left">
                <th className="py-2 pr-4">Razão social</th>
                <th className="py-2 pr-4">Categoria</th>
                <th className="py-2 pr-4">E-mail</th>
                <th className="py-2 pr-4">Telefone</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b border-slate-100">
                  <td className="py-2 pr-4">
                    <Link href={`/fornecedores/${supplier.id}/itens`} className="underline">
                      {supplier.legalName}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">{supplier.category ?? "-"}</td>
                  <td className="py-2 pr-4">{supplier.contactEmail ?? "-"}</td>
                  <td className="py-2 pr-4">{supplier.contactPhone ?? "-"}</td>
                  <td className="py-2 pr-4">{supplier.status}</td>
                  <td className="py-2">
                    <form action={archiveSupplierAction}>
                      <input type="hidden" name="supplierId" value={supplier.id} />
                      <Button type="submit" variant="outline" size="sm">Arquivar</Button>
                    </form>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-500">
                    Nenhum fornecedor cadastrado.
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
