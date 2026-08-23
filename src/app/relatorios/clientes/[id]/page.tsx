import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/shared/auth/session";
import { getCustomerById } from "@/modules/crm";
import { getCustomerReportDetail } from "@/modules/reservations";

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 p-4">
      <div className="text-xs uppercase text-slate-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

export default async function RelatorioClienteDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ano?: string }>;
}) {
  const { id } = await params;
  const { ano } = await searchParams;
  await requireUser();
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  const currentYear = new Date().getFullYear();
  const year = ano ? Number(ano) : currentYear;
  const { reservations, totals } = await getCustomerReportDetail(id, year);

  return (
    <main className="mx-auto max-w-4xl p-8 space-y-6">
      <div>
        <Link href="/relatorios/clientes" className="text-sm underline text-slate-500">
          ← Voltar
        </Link>
        <h1 className="text-2xl font-semibold">{customer.name}</h1>
        <p className="text-sm text-slate-500">Ano: {year}</p>
      </div>

      <section className="grid grid-cols-3 gap-4">
        <StatCard label="Reservas" value={String(totals.reservationCount)} />
        <StatCard label="Total vendido" value={formatCents(totals.totalSaleCents)} />
        <StatCard label="Margem total" value={formatCents(totals.totalMarginCents)} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Reservas deste cliente em {year}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-left">
                <th className="py-2 pr-4">Voucher</th>
                <th className="py-2 pr-4">Item / Fornecedor</th>
                <th className="py-2 pr-4">Saída</th>
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
                  <td className="py-2 pr-4">{reservation.item.name} — {reservation.item.supplier.legalName}</td>
                  <td className="py-2 pr-4">{formatDateTime(reservation.departureAt)}</td>
                  <td className="py-2 pr-4">{formatCents(reservation.saleAmountCents)}</td>
                  <td className="py-2 pr-4">{formatCents(reservation.marginCents)}</td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-500">
                    Nenhuma reserva neste ano.
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
