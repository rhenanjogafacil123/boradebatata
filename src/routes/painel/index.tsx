
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, ChefHat, LayoutDashboard, MoveRight, MonitorSmartphone } from "lucide-react";

export const Route = createFileRoute("/painel/")({
  component: PanelEntry,
  head: () => ({ meta: [{ title: "Painéis | Bora de Batata" }, { name: "robots", content: "noindex,nofollow" }] }),
});

const roles = [
  {
    title: "Dona / Administrador",
    description: "Visão do negócio com faturamento, pedidos, ticket médio, pagamentos, produtos e indicadores.",
    icon: LayoutDashboard,
    to: "/painel/admin" as const,
    eyebrow: "Desktop",
    tone: "bg-violet-50 text-violet-600",
  },
  {
    title: "Atendente",
    description: "Central operacional com Kanban de pedidos, preparo, produtos esgotados e motoboys disponíveis.",
    icon: ChefHat,
    to: "/painel/pedidos" as const,
    eyebrow: "Desktop",
    tone: "bg-orange-50 text-orange-600",
  },
  {
    title: "Motoboy",
    description: "Aplicativo mobile com entregas disponíveis, rotas, ganhos, status online e pedidos em andamento.",
    icon: Bike,
    to: "/painel/motoboy" as const,
    eyebrow: "Mobile",
    tone: "bg-blue-50 text-blue-600",
  },
];

function PanelEntry() {
  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm">
            <img src="/bora-logo.svg" alt="Bora de Batata" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-950">Bora de Batata</div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-500">Área interna</div>
          </div>
        </div>

        <div className="mt-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-orange-600">
            <MonitorSmartphone className="h-3.5 w-3.5" /> Painéis separados por função
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Gestão organizada, sem misturar funções.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-500">
            Administração e atendimento ficam em telas desktop. O motoboy usa uma experiência mobile própria, mais simples e direta.
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
                <div className="flex items-start justify-between">
                  <div className={"grid h-12 w-12 place-items-center rounded-2xl " + role.tone}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                    {role.eyebrow}
                  </span>
                </div>
                <h2 className="mt-6 text-lg font-extrabold text-slate-950">{role.title}</h2>
                <p className="mt-2 min-h-20 text-sm leading-6 text-slate-500">{role.description}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-extrabold text-orange-600">
                  Abrir painel
                  <MoveRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400">
          <span>Estrutura visual pronta para receber autenticação e banco.</span>
          <Link to="/" className="font-bold text-slate-600 hover:text-slate-950">
            ← Voltar para o cardápio
          </Link>
        </div>
      </div>
    </div>
  );
}
