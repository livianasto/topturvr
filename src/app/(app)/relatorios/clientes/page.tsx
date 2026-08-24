import Link from "next/link";
import { requireUser } from "@/shared/auth/session";
import { getCustomerReport } from "@/modules/reservations";

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function RelatorioClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>;
}) {
  const { ano } = await searchParams;
  await requireUser();
  const currentYear = new Date().getFullYear();
  const year = ano ? Number(ano) : currentYear;
  const rows = await getCustomerReport(year);

  return (
    <main className="mx-auto max-w-4xl p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Relatório por Cliente</h1>
      <p className="text-sm text-slate-500">Vendas do ano por cliente.</p>

      <form className="flex items-end gap-2">
        <div className="space-y-1">
          <label htmlFor="ano" className="text-sm font-medium">Ano</label>
          <input
            id="ano"
            name="ano"
            type="number"
            defaultValue={year}
            className="flex h-10 w-28 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="h-10 rounded-md border border-slate-300 px-4 text-sm">
          Filtrar
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-4">Cliente</th>
              <th className="py-2 pr-4">Reservas</th>
              <th className="py-2 pr-4">Total vendido ({year})</th>
              <th className="py-2 pr-4">Margem total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.customerId} className="border-b border-slate-100">
                <td className="py-2 pr-4">
                  <Link href={`/relatorios/clientes/${row.customerId}?ano=${year}`} className="underline">
                    {row.customerName}
                  </Link>
                </td>
                <td className="py-2 pr-4">{row.reservationCount}</td>
                <td className="py-2 pr-4">{formatCents(row.totalSaleCents)}</td>
                <td className="py-2 pr-4">{formatCents(row.totalMarginCents)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-slate-500">
                  Nenhuma venda registrada em {year}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
