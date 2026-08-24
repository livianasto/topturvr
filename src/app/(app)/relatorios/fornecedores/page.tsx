import Link from "next/link";
import { requireUser } from "@/shared/auth/session";
import { getSupplierReport } from "@/modules/reservations";

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function RelatorioFornecedoresPage() {
  await requireUser();
  const rows = await getSupplierReport();

  return (
    <main className="mx-auto max-w-4xl p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Relatório por Fornecedor</h1>
      <p className="text-sm text-slate-500">
        Quantas reservas (veículos/serviços) estão agendadas com cada fornecedor.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-4">Fornecedor</th>
              <th className="py-2 pr-4">Reservas</th>
              <th className="py-2 pr-4">Total comprado</th>
              <th className="py-2 pr-4">Total vendido</th>
              <th className="py-2 pr-4">Margem total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.supplierId} className="border-b border-slate-100">
                <td className="py-2 pr-4">
                  <Link href={`/relatorios/fornecedores/${row.supplierId}`} className="underline">
                    {row.supplierName}
                  </Link>
                </td>
                <td className="py-2 pr-4">{row.reservationCount}</td>
                <td className="py-2 pr-4">{formatCents(row.totalPurchaseCents)}</td>
                <td className="py-2 pr-4">{formatCents(row.totalSaleCents)}</td>
                <td className="py-2 pr-4">{formatCents(row.totalMarginCents)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-slate-500">
                  Nenhuma reserva registrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
