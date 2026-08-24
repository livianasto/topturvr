import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/shared/auth/session";
import { getSupplierById } from "@/modules/suppliers";
import { getSupplierReportDetail } from "@/modules/reservations";

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

export default async function RelatorioFornecedorDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireUser();
  const supplier = await getSupplierById(id);
  if (!supplier) notFound();

  const { reservations, totals } = await getSupplierReportDetail(id);

  return (
    <main className="mx-auto max-w-4xl p-8 space-y-6">
      <div>
        <Link href="/relatorios/fornecedores" className="text-sm underline text-slate-500">
          ← Voltar
        </Link>
        <h1 className="text-2xl font-semibold">{supplier.legalName}</h1>
      </div>

      <section className="grid grid-cols-4 gap-4">
        <StatCard label="Reservas" value={String(totals.reservationCount)} />
        <StatCard label="Total comprado" value={formatCents(totals.totalPurchaseCents)} />
        <StatCard label="Total vendido" value={formatCents(totals.totalSaleCents)} />
        <StatCard label="Margem total" value={formatCents(totals.totalMarginCents)} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Reservas com este fornecedor</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-left">
                <th className="py-2 pr-4">Voucher</th>
                <th className="py-2 pr-4">Cliente</th>
                <th className="py-2 pr-4">Item</th>
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
                  <td className="py-2 pr-4">{reservation.customer.name}</td>
                  <td className="py-2 pr-4">{reservation.item.name}</td>
                  <td className="py-2 pr-4">{formatDateTime(reservation.departureAt)}</td>
                  <td className="py-2 pr-4">{formatCents(reservation.saleAmountCents)}</td>
                  <td className="py-2 pr-4">{formatCents(reservation.marginCents)}</td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-500">
                    Nenhuma reserva com este fornecedor ainda.
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
