export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">Toptur Operations</h1>
      <p className="text-slate-600">
        Fundação técnica do sistema. Painéis operacionais chegam nos próximos
        módulos.
      </p>
      <a href="/api/health" className="text-sm underline text-slate-500">
        Ver status do sistema (/api/health)
      </a>
    </main>
  );
}
