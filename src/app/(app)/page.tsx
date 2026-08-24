import Link from "next/link";

const SECTIONS = [
  {
    href: "/reservas",
    title: "Reservas",
    description: "Criar e acompanhar as vendas, com voucher, passageiros e valores.",
  },
  {
    href: "/clientes",
    title: "Clientes",
    description: "Cadastro de clientes com documento, e-mail e telefone.",
  },
  {
    href: "/fornecedores",
    title: "Fornecedores",
    description: "Fornecedores e os itens que cada um oferece (veículos, hotéis, seguros).",
  },
  {
    href: "/relatorios/fornecedores",
    title: "Relatório por Fornecedor",
    description: "O que está agendado com cada fornecedor e para qual cliente.",
  },
  {
    href: "/relatorios/clientes",
    title: "Relatório por Cliente",
    description: "Vendas do ano por cliente, com totais e margem.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Toptur Operations</h1>
        <p className="text-slate-600">Gestão de reservas, cadastros e relatórios.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-md border border-slate-200 bg-white p-4 hover:border-slate-400"
          >
            <div className="font-medium">{section.title}</div>
            <p className="mt-1 text-sm text-slate-600">{section.description}</p>
          </Link>
        ))}
      </div>

      <Link href="/api/health" className="inline-block text-xs underline text-slate-500">
        Status do sistema
      </Link>
    </main>
  );
}
