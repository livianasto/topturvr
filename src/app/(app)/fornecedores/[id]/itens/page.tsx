import { notFound } from "next/navigation";
import { requireUser } from "@/shared/auth/session";
import {
  getSupplierById,
  createItem,
  listItemsBySupplier,
  archiveItem,
  updateItem,
} from "@/modules/suppliers";
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

  async function updateItemAction(formData: FormData) {
    "use server";
    const actor = await requireUser();
    const capacityRaw = formData.get("capacity")?.toString();

    await updateItem({
      actorId: actor.id,
      actorPermissions: actor.permissions,
      itemId: String(formData.get("itemId")),
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
        <h2 className="text-lg font-medium">Itens cadastrados ({items.length})</h2>

        {items.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum item cadastrado.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-slate-500">
                      {" "}
                      · {CATEGORY_LABELS[item.category]} ·{" "}
                      {item.capacity ? `${item.capacity} lugares` : "sem capacidade"}
                      {item.description ? ` · ${item.description}` : ""}
                    </span>
                  </div>
                  <form action={archiveItemAction}>
                    <input type="hidden" name="itemId" value={item.id} />
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
                    action={updateItemAction}
                    className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4"
                  >
                    <input type="hidden" name="itemId" value={item.id} />
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Nome</label>
                      <Input name="name" defaultValue={item.name} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Categoria</label>
                      <select
                        name="category"
                        defaultValue={item.category}
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                      >
                        <option value="VEHICLE">Veículo</option>
                        <option value="HOTEL">Hotel</option>
                        <option value="INSURANCE">Seguro</option>
                        <option value="OTHER">Outro</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Capacidade</label>
                      <Input
                        name="capacity"
                        type="number"
                        min={1}
                        defaultValue={item.capacity ?? ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Descrição</label>
                      <Input name="description" defaultValue={item.description ?? ""} />
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
