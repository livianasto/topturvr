import Link from "next/link";

/**
 * Cabecalho de navegacao das telas internas. Nao aparece no login nem no
 * formulario publico de passageiros (/p/[token]), que sao telas para
 * quem nao esta logado.
 */
const LINKS = [
  { href: "/clientes", label: "Clientes" },
  { href: "/fornecedores", label: "Fornecedores" },
  { href: "/reservas", label: "Reservas" },
  { href: "/relatorios/fornecedores", label: "Relatório: Fornecedores" },
  { href: "/relatorios/clientes", label: "Relatório: Clientes" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 p-4">
        <Link href="/" className="font-semibold">
          Toptur
        </Link>
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
