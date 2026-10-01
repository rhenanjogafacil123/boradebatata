
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, ChefHat, LayoutDashboard, MoveRight } from "lucide-react";

export const Route = createFileRoute("/painel/")({
  component: PanelEntry,
  head: () => ({ meta: [{ title: "Painel | Bora de Batata" }] }),
});

const roles = [
  {
    title: "Dona / Administrador",
    description: "Faturamento, pedidos, produtos, equipe e indicadores do negócio.",
    icon: LayoutDashboard,
    to: "/painel/admin" as const,
    tone: "bg-violet-50 text-violet-600",
  },
  {
    title: "Atendente",
    description: "Central de pedidos em tempo real, preparo, entrega e motoboys.",
    icon: ChefHat,
    to: "/painel/pedidos" as const,
    tone: "bg-orange-50 text-orange-600",
  },
  {
    title: "Motoboy",
    description: "Entregas disponíveis, rotas, ganhos e histórico.",
    icon: Bike,
    to: "/painel/motoboy" as const,
    tone: "bg-blue-50 text-blue-600",
  },
];

function PanelEntry() {
  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3">
          <img src="/bora-logo.svg" alt="Bora de Batata" className="h-12 w-12 rounded-2xl bg-white object-contain p-1 shadow-sm" />
          <div>
            <div className="text-sm font-extrabold text-orange-600">Bora de Batata</div>
            <div className="text-xs text-slate-500">Área de gestão</div>
          </div>
        </div>

        <div className="mt-16 max-w-2xl">
          <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
            Primeira versão
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Painéis da operação
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-500">
            A estrutura visual e os primeiros fluxos já estão funcionando com dados de demonstração. O próximo passo será ligar tudo ao banco e ao login.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.title}
                to={role.to}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_22px_50px_-38px_rgba(15,23,42,.45)] transition hover:-translate-y-1 hover:border-orange-200"
              >
                <div className={"grid h-12 w-12 place-items-center rounded-2xl " + role.tone}>
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-6 text-lg font-extrabold text-slate-950">{role.title}</h2>
                <p className="mt-2 min-h-16 text-sm leading-6 text-slate-500">{role.description}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-orange-600">
                  Abrir painel
                  <MoveRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        <Link to="/" className="mt-10 inline-block text-sm font-semibold text-slate-500 hover:text-slate-950">
          ← Voltar para o cardápio
        </Link>
      </div>
    </div>
  );
}
