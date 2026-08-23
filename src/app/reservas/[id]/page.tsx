import { notFound } from "next/navigation";
import { requireUser } from "@/shared/auth/session";
import { getReservation, addPassenger } from "@/modules/reservations";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";
import { revalidatePath } from "next/cache";

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

/**
 * Data de nascimento e data de negocio (sem hora), armazenada como
 * meia-noite UTC. Formatar em America/Sao_Paulo (UTC-3) faria a data
 * retroceder um dia, entao formatamos em UTC. Ver DATA_MODEL.md secao 1:
 * "datas de negocio usam data local; eventos usam timestamp UTC".
 */
function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export default async function ReservaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const reservation = await getReservation(id);
  if (!reservation) notFound();

  async function addPassengerAction(formData: FormData) {
    "use server";
    const actor = await requireUser();

    await addPassenger({
      actorId: actor.id,
      actorPermissions: actor.permissions,
      reservationId: id,
      fullName: String(formData.get("fullName")),
      cpf: formData.get("cpf")?.toString() || undefined,
      rg: formData.get("rg")?.toString() || undefined,
      birthDate: formData.get("birthDate")?.toString() || undefined,
      phone: formData.get("phone")?.toString() || undefined,
    });

    revalidatePath(`/reservas/${id}`);
  }

  return (
    <main className="mx-auto max-w-4xl p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold font-mono">Voucher #{reservation.voucherNumber}</h1>
        <p className="text-sm text-slate-500">Logado como {user.email}</p>
      </div>

      <section className="grid grid-cols-2 gap-4 text-sm border border-slate-200 rounded-md p-4">
        <div><span className="font-medium">Cliente:</span> {reservation.customer.name}</div>
        <div><span className="font-medium">Item:</span> {reservation.item.name} ({reservation.item.supplier.legalName})</div>
        <div><span className="font-medium">Saída:</span> {formatDateTime(reservation.departureAt)}</div>
        <div><span className="font-medium">Retorno:</span> {formatDateTime(reservation.returnAt)}</div>
        <div><span className="font-medium">Destino:</span> {reservation.destinationCity}/{reservation.destinationState}</div>
        <div><span className="font-medium">Pontos a visitar:</span> {reservation.tourStops ?? "-"}</div>
        <div><span className="font-medium">Valor de compra:</span> {formatCents(reservation.purchaseAmountCents)}</div>
        <div><span className="font-medium">Valor de venda:</span> {formatCents(reservation.saleAmountCents)}</div>
        <div><span className="font-medium">Margem:</span> {formatCents(reservation.marginCents)}</div>
        <div><span className="font-medium">Status:</span> {reservation.status}</div>
        <div><span className="font-medium">Responsável:</span> {reservation.responsibleName} {reservation.responsiblePhone ? `(${reservation.responsiblePhone})` : ""}</div>
        {reservation.customerNotes && (
          <div className="col-span-2"><span className="font-medium">Obs. cliente:</span> {reservation.customerNotes}</div>
        )}
        {reservation.supplierNotes && (
          <div className="col-span-2"><span className="font-medium">Obs. fornecedor:</span> {reservation.supplierNotes}</div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Adicionar passageiro</h2>
        <form action={addPassengerAction} className="grid grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-2 col-span-2">
            <label htmlFor="fullName" className="text-sm font-medium">Nome completo</label>
            <Input id="fullName" name="fullName" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
            <Input id="cpf" name="cpf" />
          </div>
          <div className="space-y-2">
            <label htmlFor="rg" className="text-sm font-medium">RG</label>
            <Input id="rg" name="rg" />
          </div>
          <div className="space-y-2">
            <label htmlFor="birthDate" className="text-sm font-medium">Data de nascimento</label>
            <Input id="birthDate" name="birthDate" type="date" />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
            <Input id="phone" name="phone" />
          </div>
          <div className="col-span-2">
            <Button type="submit">Adicionar</Button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Passageiros ({reservation.passengers.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-left">
                <th className="py-2 pr-4">Nome</th>
                <th className="py-2 pr-4">CPF</th>
                <th className="py-2 pr-4">RG</th>
                <th className="py-2 pr-4">Nascimento</th>
                <th className="py-2 pr-4">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {reservation.passengers.map((passenger) => (
                <tr key={passenger.id} className="border-b border-slate-100">
                  <td className="py-2 pr-4">{passenger.fullName}</td>
                  <td className="py-2 pr-4">{passenger.cpf ?? "-"}</td>
                  <td className="py-2 pr-4">{passenger.rg ?? "-"}</td>
                  <td className="py-2 pr-4">{formatDate(passenger.birthDate)}</td>
                  <td className="py-2 pr-4">{passenger.phone ?? "-"}</td>
                </tr>
              ))}
              {reservation.passengers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-500">
                    Nenhum passageiro adicionado ainda.
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
