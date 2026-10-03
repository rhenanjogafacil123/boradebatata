import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  ReceiptText,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import { DashboardShell, PanelCard } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/painel/financeiro")({
  component: FinanceDashboard,
  head: () => ({
    meta: [
      { title: "Financeiro | Bora de Batata" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const weekly = [
  { day: "Seg", revenue: 1480, expenses: 620 },
  { day: "Ter", revenue: 1860, expenses: 710 },
  { day: "Qua", revenue: 1720, expenses: 680 },
  { day: "Qui", revenue: 2210, expenses: 840 },
  { day: "Sex", revenue: 2450, expenses: 910 },
  { day: "Sáb", revenue: 3180, expenses: 1120 },
  { day: "Dom", revenue: 2843, expenses: 1035 },
];

const transactions = [
  ["#1052", "Pedido • João Silva", "Pix", "Entrada", "R$ 52,90", "14:32"],
  ["#1051", "Pedido • Mariana Costa", "Cartão", "Entrada", "R$ 37,00", "14:28"],
  ["—", "Compra de embalagens", "Pix", "Saída", "R$ 186,40", "13:51"],
  ["#1050", "Pedido • Carlos Ribeiro", "Dinheiro", "Entrada", "R$ 28,50", "13:45"],
  ["—", "Reposição de bebidas", "Cartão", "Saída", "R$ 241,80", "12:16"],
];

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function FinanceDashboard() {
  const [period, setPeriod] = useState("7 dias");
  const max = Math.max(...weekly.map((item) => item.revenue));

  return (
    <DashboardShell active="financeiro" role="Administrador" name="Rafael Lima">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-500">Gestão financeira</p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Dados demonstrativos</span>
          </div>
          <h1 className="mt-1 text-[34px] font-extrabold tracking-[-0.035em]">Financeiro</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Acompanhe faturamento, despesas, saldo e formas de pagamento.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["Hoje", "7 dias", "30 dias"].map((item) => (
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
          [TrendingUp, "Faturamento", "R$ 13.742,30", "↑ 18,4% no período", "bg-emerald-50 text-emerald-600", "text-emerald-600"],
          [CircleDollarSign, "Resultado estimado", "R$ 8.286,10", "60,3% do faturamento", "bg-violet-50 text-violet-600", "text-violet-600"],
          [ReceiptText, "Despesas", "R$ 5.456,20", "↑ 4,1% no período", "bg-rose-50 text-rose-600", "text-rose-600"],
          [WalletCards, "A receber", "R$ 1.184,70", "Cartões pendentes", "bg-blue-50 text-blue-600", "text-blue-600"],
        ].map(([Icon, label, value, note, tone, noteTone]) => {
          const MetricIcon = Icon as typeof TrendingUp;
          return (
            <PanelCard key={String(label)} className="p-5">
              <div className="flex items-start gap-4">
                <div className={"grid h-11 w-11 place-items-center rounded-2xl " + String(tone)}>
                  <MetricIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{String(label)}</p>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight">{String(value)}</p>
                  <p className={"mt-2 text-[10px] font-extrabold " + String(noteTone)}>{String(note)}</p>
                </div>
              </div>
            </PanelCard>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1.55fr)_minmax(320px,.75fr)] gap-4">
        <PanelCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-orange-500" />
                <h2 className="font-extrabold">Fluxo de caixa</h2>
              </div>
              <p className="mt-2 text-xs text-slate-400">Entradas x despesas • {period}</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Entradas</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Despesas</span>
            </div>
          </div>

          <div className="mt-8 grid h-[260px] grid-cols-7 items-end gap-4 border-b border-slate-200 px-4">
            {weekly.map((item) => (
              <div key={item.day} className="flex h-full flex-col justify-end">
                <div className="flex flex-1 items-end justify-center gap-1.5">
                  <div
                    className="w-5 rounded-t-lg bg-orange-500"
                    style={{ height: String((item.revenue / max) * 100) + "%" }}
                    title={"Entradas: " + money.format(item.revenue)}
                  />
                  <div
                    className="w-5 rounded-t-lg bg-slate-300"
                    style={{ height: String((item.expenses / max) * 100) + "%" }}
                    title={"Despesas: " + money.format(item.expenses)}
                  />
                </div>
                <div className="py-3 text-center text-[10px] font-bold text-slate-400">{item.day}</div>
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard className="p-6">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-500" />
            <h2 className="font-extrabold">Recebimentos</h2>
          </div>
          <div className="mt-7 space-y-5">
            {[
              ["Pix", "R$ 7.145,99", 52, "bg-emerald-500"],
              ["Cartão", "R$ 4.534,96", 33, "bg-blue-500"],
              ["Dinheiro", "R$ 2.061,35", 15, "bg-amber-400"],
            ].map(([label, value, percent, tone]) => (
              <div key={String(label)}>
                <div className="flex items-center text-xs">
                  <span className="font-extrabold">{String(label)}</span>
                  <span className="ml-auto font-extrabold">{String(value)}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={"h-full rounded-full " + String(tone)} style={{ width: String(percent) + "%" }} />
                </div>
                <div className="mt-1 text-right text-[10px] font-semibold text-slate-400">{String(percent)}%</div>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-extrabold">
              <Banknote className="h-4 w-4 text-emerald-600" /> Caixa de hoje
            </div>
            <div className="mt-2 text-2xl font-extrabold">R$ 1.906,14</div>
            <div className="mt-1 text-[10px] font-semibold text-slate-400">Após despesas registradas</div>
          </div>
        </PanelCard>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)] gap-4">
        <PanelCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-extrabold">Movimentações recentes</h2>
              <p className="mt-1 text-xs text-slate-400">Entradas e saídas registradas no período</p>
            </div>
            <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-extrabold text-slate-500">
              Exportar
            </button>
          </div>
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-slate-50 text-slate-400">
              <tr>
                <th className="px-5 py-3">Ref.</th><th>Descrição</th><th>Pagamento</th><th>Tipo</th><th>Valor</th><th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(([ref, description, payment, type, value, time]) => (
                <tr key={description} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-bold text-slate-500">{ref}</td>
                  <td className="font-extrabold">{description}</td>
                  <td className="text-slate-500">{payment}</td>
                  <td>
                    <span className={"inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-extrabold " + (type === "Entrada" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
                      {type === "Entrada" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {type}
                    </span>
                  </td>
                  <td className="font-extrabold">{value}</td>
                  <td className="text-slate-400">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PanelCard>

        <PanelCard className="p-5">
          <div className="flex items-center gap-2">
            <ReceiptText className="h-5 w-5 text-orange-500" />
            <h2 className="font-extrabold">Despesas por categoria</h2>
          </div>
          <div className="mt-5 space-y-4">
            {[
              ["Ingredientes", "R$ 2.486,20", 46],
              ["Embalagens", "R$ 1.104,80", 20],
              ["Entregas", "R$ 946,00", 17],
              ["Taxas", "R$ 519,20", 10],
              ["Outros", "R$ 400,00", 7],
            ].map(([label, value, percent]) => (
              <div key={String(label)}>
                <div className="flex items-center text-xs">
                  <span className="font-semibold text-slate-600">{String(label)}</span>
                  <span className="ml-auto font-extrabold">{String(value)}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-orange-400" style={{ width: String(percent) + "%" }} />
                </div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>
    </DashboardShell>
  );
}
