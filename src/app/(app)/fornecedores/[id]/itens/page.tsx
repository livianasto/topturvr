import { notFound } from "next/navigation";
import { requireUser } from "@/shared/auth/session";
import { getSupplierById, createItem, listItemsBySupplier, archiveItem } from "@/modules/suppliers";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";
import { revalidatePath } from "next/cache";

const CATEGORY_LABELS: Record<string, string> = {
  VEHICLE: "Veículo",
  HOTEL: "Hotel",
  INSURANCE: "Seguro",
  OTHER: "Outro",
};

export default async function ItensDoFornecedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const supplier = await getSupplierById(id);
  if (!supplier) notFound();

  const items = await listItemsBySupplier(id);

  async function createItemAction(formData: FormData) {
    "use server";
    const actor = await requireUser();
    const capacityRaw = formData.get("capacity")?.toString();

    await createItem({
      actorId: actor.id,
      actorPermissions: actor.permissions,
      supplierId: id,
      name: String(formData.get("name")),
      category: formData.get("category") as "VEHICLE" | "HOTEL" | "INSURANCE" | "OTHER",
      capacity: capacityRaw ? Number(capacityRaw) : undefined,
      description: formData.get("description")?.toString() || undefined,
    });

    revalidatePath(`/fornecedores/${id}/itens`);
  }

  async function archiveItemAction(formData: FormData) {
    "use server";
    const actor = await requireUser();

    await archiveItem({
      actorId: actor.id,
      actorPermissions: actor.permissions,
      itemId: String(formData.get("itemId")),
    });

    revalidatePath(`/fornecedores/${id}/itens`);
  }

  return (
    <main className="mx-auto max-w-4xl p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Itens de {supplier.legalName}</h1>
        <p className="text-sm text-slate-500">Logado como {user.email}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Novo item</h2>
        <form action={createItemAction} className="grid grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-2 col-span-2">
            <label htmlFor="name" className="text-sm font-medium">Nome</label>
            <Input id="name" name="name" placeholder="ex: Ônibus, Van, Hotel X" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Categoria</label>
            <select
              id="category"
              name="category"
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              defaultValue="OTHER"
            >
              <option value="VEHICLE">Veículo</option>
              <option value="HOTEL">Hotel</option>
              <option value="INSURANCE">Seguro</option>
              <option value="OTHER">Outro</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="capacity" className="text-sm font-medium">Capacidade (lugares)</label>
            <Input id="capacity" name="capacity" type="number" min={1} />
          </div>
          <div className="space-y-2 col-span-2">
            <label htmlFor="description" className="text-sm font-medium">Descrição</label>
            <Input id="description" name="description" />
          </div>
          <div className="col-span-2">
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Itens cadastrados</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-left">
                <th className="py-2 pr-4">Nome</th>
                <th className="py-2 pr-4">Categoria</th>
                <th className="py-2 pr-4">Capacidade</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-2 pr-4">{item.name}</td>
                  <td className="py-2 pr-4">{CATEGORY_LABELS[item.category]}</td>
                  <td className="py-2 pr-4">{item.capacity ?? "-"}</td>
                  <td className="py-2 pr-4">{item.status}</td>
                  <td className="py-2">
                    <form action={archiveItemAction}>
                      <input type="hidden" name="itemId" value={item.id} />
                      <Button type="submit" variant="outline" size="sm">Arquivar</Button>
                    </form>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-500">
                    Nenhum item cadastrado.
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
