import { SiteHeader } from "@/shared/ui/components/site-header";

/**
 * Layout das telas internas: adiciona o cabecalho de navegacao em todas
 * elas de uma vez. O login e o formulario publico de passageiros ficam
 * fora deste grupo, entao nao recebem o menu.
 *
 * "(app)" e um route group do Next.js: agrupa arquivos sem aparecer na
 * URL - /clientes continua sendo /clientes.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
