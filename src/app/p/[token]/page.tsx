import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPublicReservation, addPassengerPublicly } from "@/modules/reservations";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";

/**
 * Pagina PUBLICA - sem login. A autorizacao vem do token secreto na URL.
 * Nao exibe valores, margem, nem dados pessoais de outros passageiros
 * alem do nome.
 */

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function FormularioPublicoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const reservation = await getPublicReservation(token);
  if (!reservation) notFound();

  const isFull =
    reservation.capacity !== null &&
    reservation.passengerNames.length >= reservation.capacity;
  const isClosed = reservation.status === "CANCELLED";

  async function addPassengerAction(formData: FormData) {
    "use server";

    await addPassengerPublicly({
      token,
      fullName: String(formData.get("fullName")),
      cpf: formData.get("cpf")?.toString() || undefined,
      rg: formData.get("rg")?.toString() || undefined,
      birthDate: formData.get("birthDate")?.toString() || undefined,
      phone: formData.get("phone")?.toString() || undefined,
    });

    revalidatePath(`/p/${token}`);
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-slate-500">Toptur</p>
        <h1 className="text-2xl font-semibold">Lista de passageiros</h1>
        <p className="text-sm text-slate-600">
          {reservation.customerName} — {reservation.itemName}
        </p>
      </header>

      <section className="rounded-md border border-slate-200 bg-white p-4 text-sm space-y-1">
        <div>
          <span className="font-medium">Destino:</span> {reservation.destinationCity}/
          {reservation.destinationState}
        </div>
        <div>
          <span className="font-medium">Saída:</span> {formatDateTime(reservation.departureAt)}
        </div>
        <div>
          <span className="font-medium">Retorno:</span> {formatDateTime(reservation.returnAt)}
        </div>
        {reservation.tourStops && (
          <div>
            <span className="font-medium">Roteiro:</span> {reservation.tourStops}
          </div>
        )}
        <div>
          <span className="font-medium">Responsável:</span> {reservation.responsibleName}
        </div>
        {reservation.capacity !== null && (
          <div>
            <span className="font-medium">Vagas:</span> {reservation.passengerNames.length} de{" "}
            {reservation.capacity} preenchidas
          </div>
        )}
      </section>

      {isClosed ? (
        <p className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Esta reserva foi cancelada e não está mais aceitando passageiros.
        </p>
      ) : isFull ? (
        <p className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          A lista já está completa ({reservation.capacity} passageiros). Fale com a
          Toptur se precisar incluir mais alguém.
        </p>
      ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-medium">Adicionar passageiro</h2>
          <form action={addPassengerAction} className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Nome completo
              </label>
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
              <label htmlFor="birthDate" className="text-sm font-medium">
                Data de nascimento
              </label>
              <Input id="birthDate" name="birthDate" type="date" />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
              <Input id="phone" name="phone" />
            </div>
            <div className="col-span-2">
              <Button type="submit">Adicionar à lista</Button>
            </div>
          </form>
          <p className="text-xs text-slate-500">
            Os dados informados são usados apenas para a organização desta viagem.
          </p>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-lg font-medium">
          Já na lista ({reservation.passengerNames.length})
        </h2>
        {reservation.passengerNames.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum passageiro adicionado ainda.</p>
        ) : (
          <ol className="list-decimal space-y-1 pl-6 text-sm">
            {reservation.passengerNames.map((name, index) => (
              <li key={`${name}-${index}`}>{name}</li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
