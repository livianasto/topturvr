import Link from "next/link";
import { requireUser } from "@/shared/auth/session";
import { createReservation, listReservations } from "@/modules/reservations";
import { listCustomers } from "@/modules/crm";
import { listAllItemsWithSupplier } from "@/modules/suppliers";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";
import { revalidatePath } from "next/cache";

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

export default async function ReservasPage() {
  const user = await requireUser();
  const [reservations, customers, items] = await Promise.all([
    listReservations(),
    listCustomers(),
    listAllItemsWithSupplier(),
  ]);

  async function createReservationAction(formData: FormData) {
    "use server";
    const actor = await requireUser();

    const purchaseReais = Number(formData.get("purchaseAmount"));
    const saleReais = Number(formData.get("saleAmount"));

    await createReservation({
      actorId: actor.id,
      actorPermissions: actor.permissions,
      customerId: String(formData.get("customerId")),
      itemId: String(formData.get("itemId")),
      departureAt: new Date(String(formData.get("departureAt"))).toISOString(),
      returnAt: new Date(String(formData.get("returnAt"))).toISOString(),
      destinationCity: String(formData.get("destinationCity")),
      destinationState: String(formData.get("destinationState")),
      tourStops: formData.get("tourStops")?.toString() || undefined,
      purchaseAmountCents: Math.round(purchaseReais * 100),
      saleAmountCents: Math.round(saleReais * 100),
      responsibleName: String(formData.get("responsibleName")),
      responsiblePhone: formData.get("responsiblePhone")?.toString() || undefined,
      customerNotes: formData.get("customerNotes")?.toString() || undefined,
      supplierNotes: formData.get("supplierNotes")?.toString() || undefined,
    });

    revalidatePath("/reservas");
  }

  const selectClassName =
    "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400";

  return (
    <main className="mx-auto max-w-5xl p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Reservas</h1>
        <p className="text-sm text-slate-500">Logado como {user.email}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Nova reserva</h2>
        <form action={createReservationAction} className="grid grid-cols-2 gap-4 max-w-3xl">
          <div className="space-y-2">
            <label htmlFor="customerId" className="text-sm font-medium">Cliente</label>
            <select id="customerId" name="customerId" className={selectClassName} required>
              <option value="">Selecione...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="itemId" className="text-sm font-medium">Item / Fornecedor</label>
            <select id="itemId" name="itemId" className={selectClassName} required>
              <option value="">Selecione...</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.supplierName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="departureAt" className="text-sm font-medium">Data/hora de ida</label>
            <Input id="departureAt" name="departureAt" type="datetime-local" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="returnAt" className="text-sm font-medium">Data/hora de volta</label>
            <Input id="returnAt" name="returnAt" type="datetime-local" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="destinationCity" className="text-sm font-medium">Cidade de destino</label>
            <Input id="destinationCity" name="destinationCity" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="destinationState" className="text-sm font-medium">UF</label>
            <Input id="destinationState" name="destinationState" maxLength={2} required />
          </div>

          <div className="space-y-2 col-span-2">
            <label htmlFor="tourStops" className="text-sm font-medium">Pontos a visitar (tour)</label>
            <Input id="tourStops" name="tourStops" placeholder="ex: Cristo Redentor, Pão de Açúcar" />
          </div>

          <div className="space-y-2">
            <label htmlFor="purchaseAmount" className="text-sm font-medium">Valor de compra (R$)</label>
            <Input id="purchaseAmount" name="purchaseAmount" type="number" step="0.01" min={0} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="saleAmount" className="text-sm font-medium">Valor de venda (R$)</label>
            <Input id="saleAmount" name="saleAmount" type="number" step="0.01" min={0} required />
          </div>

          <div className="space-y-2">
            <label htmlFor="responsibleName" className="text-sm font-medium">Responsável na viagem</label>
            <Input id="responsibleName" name="responsibleName" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="responsiblePhone" className="text-sm font-medium">Telefone do responsável</label>
            <Input id="responsiblePhone" name="responsiblePhone" />
          </div>

          <div className="space-y-2 col-span-2">
            <label htmlFor="customerNotes" className="text-sm font-medium">Observações (cliente)</label>
            <Input id="customerNotes" name="customerNotes" />
          </div>
          <div className="space-y-2 col-span-2">
            <label htmlFor="supplierNotes" className="text-sm font-medium">Observações (fornecedor)</label>
            <Input id="supplierNotes" name="supplierNotes" />
          </div>

          <div className="col-span-2">
            <Button type="submit">Criar reserva</Button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Todas as reservas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-left">
                <th className="py-2 pr-4">Voucher</th>
                <th className="py-2 pr-4">Cliente</th>
                <th className="py-2 pr-4">Item / Fornecedor</th>
                <th className="py-2 pr-4">Saída</th>
                <th className="py-2 pr-4">Retorno</th>
                <th className="py-2 pr-4">Destino</th>
                <th className="py-2 pr-4">Venda</th>
                <th className="py-2 pr-4">Margem</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="border-b border-slate-100">
                  <td className="py-2 pr-4">
                    <Link href={`/reservas/${reservation.id}`} className="underline font-mono">
                      #{reservation.voucherNumber}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">{reservation.customerName}</td>
                  <td className="py-2 pr-4">{reservation.itemName} — {reservation.supplierName}</td>
                  <td className="py-2 pr-4">{formatDateTime(reservation.departureAt)}</td>
                  <td className="py-2 pr-4">{formatDateTime(reservation.returnAt)}</td>
                  <td className="py-2 pr-4">{reservation.destinationCity}/{reservation.destinationState}</td>
                  <td className="py-2 pr-4">{formatCents(reservation.saleAmountCents)}</td>
                  <td className="py-2 pr-4">{formatCents(reservation.marginCents)}</td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-slate-500">
                    Nenhuma reserva cadastrada.
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
