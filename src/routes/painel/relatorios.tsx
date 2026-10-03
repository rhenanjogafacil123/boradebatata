import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Clock3,
  MapPinned,
  PackageCheck,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { DashboardShell, PanelCard } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/painel/relatorios")({
  component: ReportsDashboard,
  head: () => ({
    meta: [
      { title: "Relatórios | Bora de Batata" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const neighborhoods = [
  { name: "Centro", orders: 92, revenue: "R$ 3.884", intensity: 100 },
  { name: "Jardim", orders: 78, revenue: "R$ 3.106", intensity: 85 },
  { name: "Vila Nova", orders: 61, revenue: "R$ 2.497", intensity: 66 },
  { name: "Boa Vista", orders: 49, revenue: "R$ 1.988", intensity: 53 },
  { name: "Parque Oeste", orders: 38, revenue: "R$ 1.524", intensity: 41 },
  { name: "Santa Rosa", orders: 26, revenue: "R$ 1.016", intensity: 28 },
];

const heatTone = (value: number) => {
  if (value >= 85) return "bg-orange-500 text-white";
  if (value >= 65) return "bg-orange-400 text-white";
  if (value >= 45) return "bg-amber-300 text-amber-950";
  if (value >= 30) return "bg-amber-200 text-amber-950";
  return "bg-orange-100 text-orange-800";
};

const hourly = [
  ["19h", 28],
  ["20h", 46],
  ["21h", 63],
  ["22h", 58],
  ["23h", 41],
  ["00h", 22],
];

function ReportsDashboard() {
  const [period, setPeriod] = useState("30 dias");
  const maxHourly = Math.max(...hourly.map(([, value]) => Number(value)));

  return (
    <DashboardShell active="relatorios" role="Administrador" name="Rafael Lima">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-500">Inteligência do negócio</p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Dados demonstrativos</span>
          </div>
          <h1 className="mt-1 text-[34px] font-extrabold tracking-[-0.035em]">Relatórios</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Descubra onde vende mais, quais horários são mais fortes e o que mais gira.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["7 dias", "30 dias", "90 dias"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={
                "rounded-xl px-3 py-2.5 text-xs font-extrabold transition " +
                (period === item
                  ? "bg-slate-950 text-white"
                  : "border border-slate-200 bg-white text-slate-500")
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          [ShoppingCart, "Pedidos", "344", "↑ 21% no período", "bg-blue-50 text-blue-600"],
          [TrendingUp, "Faturamento", "R$ 14.015", "↑ 18% no período", "bg-emerald-50 text-emerald-600"],
          [Users, "Clientes recorrentes", "41%", "↑ 6 p.p.", "bg-violet-50 text-violet-600"],
          [Clock3, "Pico de pedidos", "21h", "63 pedidos na faixa", "bg-orange-50 text-orange-600"],
        ].map(([Icon, label, value, note, tone]) => {
          const MetricIcon = Icon as typeof ShoppingCart;
          return (
            <PanelCard key={String(label)} className="p-5">
              <div className="flex items-start gap-4">
                <div className={"grid h-11 w-11 place-items-center rounded-2xl " + String(tone)}>
                  <MetricIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{String(label)}</p>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight">{String(value)}</p>
                  <p className="mt-2 text-[10px] font-extrabold text-emerald-600">{String(note)}</p>
                </div>
              </div>
            </PanelCard>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1.35fr)_minmax(340px,.65fr)] gap-4">
        <PanelCard className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MapPinned className="h-5 w-5 text-orange-500" />
                <h2 className="font-extrabold">Mapa de calor por bairro</h2>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Quanto mais forte a cor, maior a concentração de pedidos • {period}
              </p>
            </div>
            <div className="rounded-xl bg-orange-50 px-3 py-2 text-[10px] font-extrabold text-orange-700">
              Mock visual até conectar endereços reais
            </div>
          </div>

          <div className="mt-6 grid h-[360px] grid-cols-12 grid-rows-8 gap-2 rounded-3xl bg-slate-100 p-3">
            <div className={"col-span-5 row-span-3 flex flex-col justify-between rounded-[26px] p-5 " + heatTone(100)}>
              <span className="text-sm font-extrabold">Centro</span>
              <div><div className="text-3xl font-extrabold">92</div><div className="text-[10px] font-bold opacity-80">pedidos</div></div>
            </div>
            <div className={"col-span-4 row-span-4 flex flex-col justify-between rounded-[26px] p-5 " + heatTone(85)}>
              <span className="text-sm font-extrabold">Jardim</span>
              <div><div className="text-3xl font-extrabold">78</div><div className="text-[10px] font-bold opacity-80">pedidos</div></div>
            </div>
            <div className={"col-span-3 row-span-2 flex flex-col justify-between rounded-[26px] p-4 " + heatTone(41)}>
              <span className="text-xs font-extrabold">Parque Oeste</span>
              <div className="text-xl font-extrabold">38</div>
            </div>
            <div className={"col-span-3 row-span-2 flex flex-col justify-between rounded-[26px] p-4 " + heatTone(28)}>
              <span className="text-xs font-extrabold">Santa Rosa</span>
              <div className="text-xl font-extrabold">26</div>
            </div>
            <div className={"col-span-4 row-span-4 flex flex-col justify-between rounded-[26px] p-5 " + heatTone(66)}>
              <span className="text-sm font-extrabold">Vila Nova</span>
              <div><div className="text-3xl font-extrabold">61</div><div className="text-[10px] font-bold opacity-80">pedidos</div></div>
            </div>
            <div className={"col-span-5 row-span-3 flex flex-col justify-between rounded-[26px] p-5 " + heatTone(53)}>
              <span className="text-sm font-extrabold">Boa Vista</span>
              <div><div className="text-3xl font-extrabold">49</div><div className="text-[10px] font-bold opacity-80">pedidos</div></div>
            </div>
          </div>
        </PanelCard>

        <PanelCard className="overflow-hidden">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-extrabold">Ranking de bairros</h2>
            <p className="mt-1 text-xs text-slate-400">Pedidos e faturamento estimado</p>
          </div>
          <div>
            {neighborhoods.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 last:border-0">
                <span className={"grid h-8 w-8 place-items-center rounded-xl text-[10px] font-extrabold " + heatTone(item.intensity)}>
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold">{item.name}</div>
                  <div className="mt-1 text-[10px] font-semibold text-slate-400">{item.orders} pedidos</div>
                </div>
                <div className="text-xs font-extrabold">{item.revenue}</div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
        <PanelCard className="p-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            <h2 className="font-extrabold">Pedidos por horário</h2>
          </div>
          <div className="mt-7 grid h-[230px] grid-cols-6 items-end gap-5 border-b border-slate-200 px-5">
            {hourly.map(([hour, value]) => (
              <div key={String(hour)} className="flex h-full flex-col justify-end">
                <div className="mb-2 text-center text-[10px] font-extrabold text-slate-500">{String(value)}</div>
                <div
                  className="w-full rounded-t-2xl bg-gradient-to-t from-orange-500 to-amber-300"
                  style={{ height: String((Number(value) / maxHourly) * 78) + "%" }}
                />
                <div className="py-3 text-center text-[10px] font-bold text-slate-400">{String(hour)}</div>
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard className="p-6">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-orange-500" />
            <h2 className="font-extrabold">Itens que mais giram</h2>
          </div>
          <div className="mt-5 space-y-4">
            {[
              ["Carne moída com cheddar", 42, "R$ 1.381,80"],
              ["Strogonoff de frango", 38, "R$ 1.212,20"],
              ["Refrigerante lata", 46, "R$ 312,80"],
              ["Bacon com cheddar", 34, "R$ 1.016,60"],
              ["Pastel montável", 29, "R$ 550,71"],
            ].map(([name, sales, revenue], index) => (
              <div key={String(name)} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-50 text-xs font-extrabold text-orange-600">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-extrabold">{String(name)}</div>
                  <div className="mt-1 text-[10px] font-semibold text-slate-400">{String(sales)} vendas</div>
                </div>
                <div className="text-xs font-extrabold">{String(revenue)}</div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>
    </DashboardShell>
  );
}
