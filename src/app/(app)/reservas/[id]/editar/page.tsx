import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/shared/auth/session";
import { getReservation, updateReservation } from "@/modules/reservations";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";

/** Converte um Date para o formato aceito pelo input datetime-local. */
function toDateTimeLocal(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export default async function EditarReservaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireUser();
  const reservation = await getReservation(id);
  if (!reservation) notFound();

  const isCancelled = reservation.status === "CANCELLED";

  async function updateReservationAction(formData: FormData) {
    "use server";
    const actor = await requireUser();

    await updateReservation({
      actorId: actor.id,
      actorPermissions: actor.permissions,
      reservationId: id,
      departureAt: new Date(String(formData.get("departureAt"))).toISOString(),
      returnAt: new Date(String(formData.get("returnAt"))).toISOString(),
      destinationCity: String(formData.get("destinationCity")),
      destinationState: String(formData.get("destinationState")),
      tourStops: formData.get("tourStops")?.toString() || undefined,
      purchaseAmountCents: Math.round(Number(formData.get("purchaseAmount")) * 100),
      saleAmountCents: Math.round(Number(formData.get("saleAmount")) * 100),
      responsibleName: String(formData.get("responsibleName")),
      responsiblePhone: formData.get("responsiblePhone")?.toString() || undefined,
      customerNotes: formData.get("customerNotes")?.toString() || undefined,
      supplierNotes: formData.get("supplierNotes")?.toString() || undefined,
    });

    redirect(`/reservas/${id}`);
  }

  return (
    <main className="mx-auto max-w-3xl p-8 space-y-6">
      <div>
        <Link href={`/reservas/${id}`} className="text-sm underline text-slate-500">
          ← Voltar
        </Link>
        <h1 className="text-2xl font-semibold font-mono">
          Editar Voucher #{reservation.voucherNumber}
        </h1>
        <p className="text-sm text-slate-500">
          Cliente e item não são editáveis. Para trocá-los, cancele esta reserva e
          crie outra.
        </p>
      </div>

      {isCancelled ? (
        <p className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Esta reserva está cancelada e não pode ser editada.
        </p>
      ) : (
        <form action={updateReservationAction} className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="departureAt" className="text-sm font-medium">Data/hora de ida</label>
            <Input
              id="departureAt"
              name="departureAt"
              type="datetime-local"
              defaultValue={toDateTimeLocal(reservation.departureAt)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="returnAt" className="text-sm font-medium">Data/hora de volta</label>
            <Input
              id="returnAt"
              name="returnAt"
              type="datetime-local"
              defaultValue={toDateTimeLocal(reservation.returnAt)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="destinationCity" className="text-sm font-medium">Cidade de destino</label>
            <Input
              id="destinationCity"
              name="destinationCity"
              defaultValue={reservation.destinationCity}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="destinationState" className="text-sm font-medium">UF</label>
            <Input
              id="destinationState"
              name="destinationState"
              maxLength={2}
              defaultValue={reservation.destinationState}
              required
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label htmlFor="tourStops" className="text-sm font-medium">Pontos a visitar (tour)</label>
            <Input id="tourStops" name="tourStops" defaultValue={reservation.tourStops ?? ""} />
          </div>

          <div className="space-y-2">
            <label htmlFor="purchaseAmount" className="text-sm font-medium">Valor de compra (R$)</label>
            <Input
              id="purchaseAmount"
              name="purchaseAmount"
              type="number"
              step="0.01"
              min={0}
              defaultValue={(reservation.purchaseAmountCents / 100).toFixed(2)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="saleAmount" className="text-sm font-medium">Valor de venda (R$)</label>
            <Input
              id="saleAmount"
              name="saleAmount"
              type="number"
              step="0.01"
              min={0}
              defaultValue={(reservation.saleAmountCents / 100).toFixed(2)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="responsibleName" className="text-sm font-medium">Responsável na viagem</label>
            <Input
              id="responsibleName"
              name="responsibleName"
              defaultValue={reservation.responsibleName}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="responsiblePhone" className="text-sm font-medium">Telefone do responsável</label>
            <Input
              id="responsiblePhone"
              name="responsiblePhone"
              defaultValue={reservation.responsiblePhone ?? ""}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label htmlFor="customerNotes" className="text-sm font-medium">Observações (cliente)</label>
            <Input id="customerNotes" name="customerNotes" defaultValue={reservation.customerNotes ?? ""} />
          </div>
          <div className="space-y-2 col-span-2">
            <label htmlFor="supplierNotes" className="text-sm font-medium">Observações (fornecedor)</label>
            <Input id="supplierNotes" name="supplierNotes" defaultValue={reservation.supplierNotes ?? ""} />
          </div>

          <div className="col-span-2 flex gap-3">
            <Button type="submit">Salvar alterações</Button>
            <Link
              href={`/reservas/${id}`}
              className="inline-flex h-10 items-center rounded-md border border-slate-300 px-4 text-sm font-medium hover:bg-slate-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}
