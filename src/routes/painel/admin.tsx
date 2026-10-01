
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Banknote,
  Clock3,
  CreditCard,
  PackageCheck,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { DashboardShell, PanelCard } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/painel/admin")({
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Dashboard | Bora de Batata" }, { name: "robots", content: "noindex,nofollow" }] }),
});

const recentOrders = [
  ["#1052", "João Silva", "Em entrega", "R$ 52,90", "14:32", "blue"],
  ["#1051", "Mariana Costa", "Em preparo", "R$ 37,00", "14:28", "amber"],
  ["#1050", "Carlos Ribeiro", "Concluído", "R$ 28,50", "14:15", "green"],
  ["#1049", "Fernanda Lima", "Recebido", "R$ 46,90", "13:58", "slate"],
  ["#1048", "Lucas Mendes", "Em entrega", "R$ 61,20", "13:45", "blue"],
];

const products = [
  { name: "Carne moída com cheddar", sales: "42 vendas", value: "R$ 894,00", image: "/bora-hero.png" },
  { name: "Strogonoff de frango", sales: "38 vendas", value: "R$ 786,50", image: "/bora-hero.png" },
  { name: "Bacon com cheddar", sales: "34 vendas", value: "R$ 682,00", image: "/bora-hero.png" },
  { name: "Pastel com tudo dentro", sales: "28 vendas", value: "R$ 699,72", image: "/bora-hero.png" },
  { name: "Refrigerante lata", sales: "25 vendas", value: "R$ 170,00", image: "/bora-drink.svg" },
];

const statuses = [
  ["Concluído", 28, 41, "bg-emerald-500"],
  ["Em entrega", 14, 21, "bg-blue-500"],
  ["Em preparo", 12, 18, "bg-amber-400"],
  ["Recebido", 8, 12, "bg-slate-400"],
  ["Cancelado", 5, 7, "bg-red-500"],
];

function MetricCard({
  icon: Icon,
  label,
  value,
  note,
  tone,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  note: string;
  tone: string;
}) {
  return (
    <PanelCard className="p-5">
      <div className="flex items-start gap-4">
        <div className={"grid h-11 w-11 shrink-0 place-items-center rounded-2xl " + tone}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{value}</p>
          <p className="mt-2 text-xs font-semibold text-emerald-600">{note}</p>
        </div>
      </div>
    </PanelCard>
  );
}

function AdminDashboard() {
  return (
    <DashboardShell active="dashboard" role="Administrador" name="Rafael Lima">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">Visão do negócio</p><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Dados demonstrativos</span></div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Acompanhe a operação da Bora de Batata em um só lugar.</p>
        </div>
        <button type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-500 shadow-sm">
          Hoje
        </button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <MetricCard icon={TrendingUp} label="Faturamento hoje" value="R$ 2.843,50" note="↑ 12% em relação a ontem" tone="bg-emerald-50 text-emerald-600" />
        <MetricCard icon={ShoppingCart} label="Pedidos hoje" value="68" note="↑ 18% em relação a ontem" tone="bg-blue-50 text-blue-600" />
        <MetricCard icon={ReceiptText} label="Ticket médio" value="R$ 41,81" note="↑ 6% em relação a ontem" tone="bg-violet-50 text-violet-600" />
        <MetricCard icon={Clock3} label="Pedidos em andamento" value="14" note="Em preparo e entrega" tone="bg-orange-50 text-orange-600" />
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1.55fr)_minmax(310px,.85fr)] gap-4">
        <PanelCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h2 className="font-extrabold">Faturamento da semana</h2>
              </div>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-extrabold tracking-tight">R$ 13.742,30</span>
                <span className="text-xs font-bold text-emerald-600">↑ 28% na comparação anterior</span>
              </div>
            </div>
            <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500">Últimos 7 dias</button>
          </div>

          <div className="mt-7 overflow-hidden rounded-2xl bg-gradient-to-b from-orange-50/70 to-transparent px-2 pt-3">
            <svg viewBox="0 0 700 240" className="h-[240px] w-full" role="img" aria-label="Gráfico de faturamento semanal">
              {[40, 90, 140, 190].map((y) => (
                <line key={y} x1="20" y1={y} x2="680" y2={y} stroke="#e2e8f0" strokeWidth="1" />
              ))}
              <defs>
                <linearGradient id="admin-chart-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fb923c" stopOpacity=".28" />
                  <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M35,185 C90,170 115,145 145,148 C190,151 215,112 250,110 C300,107 320,143 355,136 C410,125 430,95 475,90 C530,84 555,58 610,56 C640,54 660,40 675,32 L675,220 L35,220 Z" fill="url(#admin-chart-fill)" />
              <path d="M35,185 C90,170 115,145 145,148 C190,151 215,112 250,110 C300,107 320,143 355,136 C410,125 430,95 475,90 C530,84 555,58 610,56 C640,54 660,40 675,32" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
              {[["35","185"],["145","148"],["250","110"],["355","136"],["475","90"],["610","56"],["675","32"]].map(([x,y]) => (
                <circle key={x} cx={x} cy={y} r="5.5" fill="#fff" stroke="#f97316" strokeWidth="3" />
              ))}
            </svg>
            <div className="-mt-2 grid grid-cols-7 pb-3 text-center text-[11px] font-semibold text-slate-400">
              {["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map((day) => <span key={day}>{day}</span>)}
            </div>
          </div>
        </PanelCard>

        <PanelCard className="p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <WalletCards className="h-5 w-5 text-orange-500" />
            <h2 className="font-extrabold">Formas de pagamento</h2>
          </div>
          <div className="mt-7 grid place-items-center">
            <div className="relative grid h-44 w-44 place-items-center rounded-full" style={{ background: "conic-gradient(#22c55e 0 52%, #3b82f6 52% 85%, #f59e0b 85% 100%)" }}>
              <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center shadow-inner">
                <div>
                  <div className="text-base font-extrabold">R$ 2.843,50</div>
                  <div className="mt-1 text-[11px] text-slate-400">total hoje</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            {[
              ["Pix", "52%", "R$ 1.477,00", "bg-emerald-500"],
              ["Cartão", "33%", "R$ 938,36", "bg-blue-500"],
              ["Dinheiro", "15%", "R$ 428,14", "bg-amber-400"],
            ].map(([name, percent, amount, dot]) => (
              <div key={name} className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0">
                <span className={"h-2.5 w-2.5 rounded-full " + dot} />
                <span className="font-semibold">{name}</span>
                <span className="ml-auto text-xs font-bold text-slate-400">{percent}</span>
                <span className="w-24 text-right text-xs font-bold text-slate-700">{amount}</span>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1.2fr)_minmax(330px,.9fr)_minmax(260px,.7fr)] gap-4">
        <PanelCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div className="flex items-center gap-2"><PackageCheck className="h-5 w-5 text-orange-500" /><h2 className="font-extrabold">Pedidos recentes</h2></div>
            <button type="button" className="text-xs font-bold text-orange-600">Ver todos →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-400">
                <tr><th className="px-5 py-3">#</th><th>Cliente</th><th>Status</th><th>Valor</th><th>Hora</th></tr>
              </thead>
              <tbody>
                {recentOrders.map(([id, client, status, value, time, tone]) => (
                  <tr key={id} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-bold">{id}</td>
                    <td className="font-semibold">{client}</td>
                    <td>
                      <span className={
                        "rounded-full px-2.5 py-1 text-[10px] font-bold " +
                        (tone === "green" ? "bg-emerald-50 text-emerald-700" : tone === "blue" ? "bg-blue-50 text-blue-700" : tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600")
                      }>{status}</span>
                    </td>
                    <td className="font-bold">{value}</td>
                    <td className="text-slate-400">{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>

        <PanelCard className="p-5">
          <div className="flex items-center gap-2"><Banknote className="h-5 w-5 text-orange-500" /><h2 className="font-extrabold">Produtos mais vendidos</h2></div>
          <div className="mt-4 space-y-3">
            {products.map((product, index) => (
              <div key={product.name} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-50 text-[11px] font-extrabold text-amber-600">{index + 1}</span>
                <img src={product.image} alt="" className="h-10 w-10 rounded-xl bg-orange-50 object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold">{product.name}</div>
                  <div className="mt-0.5 text-[10px] text-slate-400">{product.sales}</div>
                </div>
                <div className="text-xs font-extrabold">{product.value}</div>
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard className="p-5">
          <div className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-orange-500" /><h2 className="font-extrabold">Status dos pedidos</h2></div>
          <div className="mt-5 space-y-5">
            {statuses.map(([label, count, percent, bar]) => (
              <div key={String(label)}>
                <div className="mb-2 flex items-center text-xs">
                  <span className="font-semibold">{label}</span>
                  <span className="ml-auto font-extrabold">{count}</span>
                  <span className="ml-3 w-8 text-right text-[10px] text-slate-400">{percent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={"h-full rounded-full " + bar} style={{ width: String(percent) + "%" }} />
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="mt-6 flex items-center gap-2 text-xs font-bold text-orange-600">
            Relatório completo <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </PanelCard>
      </div>
    </DashboardShell>
  );
}
