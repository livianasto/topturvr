import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">Toptur Operations</h1>
      <p className="text-slate-600">Painel de cadastros e reservas.</p>
      <nav className="flex flex-col items-center gap-2 text-sm">
        <Link href="/clientes" className="underline">Clientes</Link>
        <Link href="/fornecedores" className="underline">Fornecedores</Link>
        <Link href="/reservas" className="underline">Reservas</Link>
        <Link href="/relatorios/fornecedores" className="underline">Relatório por Fornecedor</Link>
        <Link href="/relatorios/clientes" className="underline">Relatório por Cliente</Link>
      </nav>
      <Link href="/api/health" className="text-xs underline text-slate-500">
        Ver status do sistema (/api/health)
      </Link>
    </main>
  );
}
