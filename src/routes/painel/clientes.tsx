import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  ContactRound,
  Crown,
  MapPin,
  MessageCircleMore,
  PackageCheck,
  Phone,
  ReceiptText,
  Repeat2,
  Search,
  ShoppingBag,
  Sparkles,
  UserRoundCheck,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardShell, PanelCard } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/painel/clientes")({
  component: CustomersDashboard,
  head: () => ({
    meta: [
      { title: "Clientes | Bora de Batata" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type CustomerOrder = {
  id: number;
  date: string;
  items: string[];
  total: string;
  status: "Concluído" | "Cancelado";
};

type Customer = {
  id: number;
  name: string;
  phone: string;
  neighborhood: string;
  orders: number;
  spent: string;
  average: string;
  lastOrder: string;
  favorite: string;
  recurring: boolean;
  ordersHistory: CustomerOrder[];
};

const customers: Customer[] = [
  {
    id: 1,
    name: "Mariana Costa",
    phone: "(21) 98821-4452",
    neighborhood: "Campo Grande",
    orders: 18,
    spent: "R$ 786,40",
    average: "R$ 43,69",
    lastOrder: "Hoje, 14:28",
    favorite: "Bacon com cheddar • 300g",
    recurring: true,
    ordersHistory: [
      { id: 1051, date: "Hoje, 14:28", items: ["2x Bacon com cheddar • 300g"], total: "R$ 55,80", status: "Concluído" },
      { id: 1022, date: "27/09, 21:14", items: ["1x Bacon com cheddar • 300g", "1x Refrigerante lata"], total: "R$ 34,30", status: "Concluído" },
      { id: 998, date: "19/09, 20:42", items: ["1x Pastel montável", "1x Guaracamp"], total: "R$ 21,49", status: "Concluído" },
    ],
  },
  {
    id: 2,
    name: "João Silva",
    phone: "(21) 99142-7730",
    neighborhood: "Santa Cruz",
    orders: 14,
    spent: "R$ 642,90",
    average: "R$ 45,92",
    lastOrder: "Hoje, 14:32",
    favorite: "Carne moída com cheddar • 500g",
    recurring: true,
    ordersHistory: [
      { id: 1052, date: "Hoje, 14:32", items: ["1x Carne moída com cheddar • 500g", "1x Refrigerante lata"], total: "R$ 52,90", status: "Concluído" },
      { id: 1011, date: "24/09, 19:58", items: ["1x Strogonoff de frango • 500g"], total: "R$ 22,50", status: "Concluído" },
    ],
  },
  {
    id: 3,
    name: "Ana Paula",
    phone: "(21) 97420-1188",
    neighborhood: "Bangu",
    orders: 11,
    spent: "R$ 438,20",
    average: "R$ 39,84",
    lastOrder: "Ontem, 22:10",
    favorite: "Pastel com tudo dentro",
    recurring: true,
    ordersHistory: [
      { id: 1045, date: "Ontem, 22:10", items: ["1x Pastel com tudo dentro", "1x Refrigerante lata"], total: "R$ 31,79", status: "Concluído" },
      { id: 1004, date: "22/09, 20:19", items: ["1x Carne moída com catupiry • 300g"], total: "R$ 20,00", status: "Concluído" },
    ],
  },
  {
    id: 4,
    name: "Lucas Mendes",
    phone: "(21) 98211-8301",
    neighborhood: "Realengo",
    orders: 9,
    spent: "R$ 387,10",
    average: "R$ 43,01",
    lastOrder: "Ontem, 21:36",
    favorite: "Calabresa com cheddar • 500g",
    recurring: false,
    ordersHistory: [
      { id: 1047, date: "Ontem, 21:36", items: ["1x Calabresa com cheddar • 500g", "1x Refrigerante lata"], total: "R$ 26,80", status: "Concluído" },
      { id: 987, date: "17/09, 19:44", items: ["1x Bacon com catupiry • 500g"], total: "R$ 21,50", status: "Cancelado" },
    ],
  },
  {
    id: 5,
    name: "Fernanda Lima",
    phone: "(21) 99763-9120",
    neighborhood: "Senador Camará",
    orders: 8,
    spent: "R$ 314,60",
    average: "R$ 39,33",
    lastOrder: "02/10, 20:11",
    favorite: "Strogonoff de frango • 500g",
    recurring: false,
    ordersHistory: [
      { id: 1041, date: "02/10, 20:11", items: ["1x Strogonoff de frango • 500g", "1x Guaracamp"], total: "R$ 25,00", status: "Concluído" },
    ],
  },
  {
    id: 6,
    name: "Carlos Ribeiro",
    phone: "(21) 98044-5012",
    neighborhood: "Paciência",
    orders: 7,
    spent: "R$ 276,50",
    average: "R$ 39,50",
    lastOrder: "01/10, 19:52",
    favorite: "Strogonoff de frango • 500g",
    recurring: false,
    ordersHistory: [
      { id: 1050, date: "01/10, 19:52", items: ["1x Strogonoff de frango • 500g", "1x Guaracamp"], total: "R$ 25,00", status: "Concluído" },
    ],
  },
];

function CustomersDashboard() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [repeatFeedback, setRepeatFeedback] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return customers;
    return customers.filter((customer) =>
      [customer.name, customer.phone, customer.neighborhood, customer.favorite]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(normalized),
    );
  }, [query]);

  const recurringCount = customers.filter((customer) => customer.recurring).length;
  const totalOrders = customers.reduce((sum, customer) => sum + customer.orders, 0);

  function simulateRepeat(orderId: number) {
    setRepeatFeedback(orderId);
    window.setTimeout(() => setRepeatFeedback(null), 2200);
  }

  return (
    <DashboardShell
      active="clientes"
      role="Administrador"
      name="Rafael Lima"
      search={{ value: query, onChange: setQuery, placeholder: "Buscar cliente, bairro ou telefone..." }}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-500">Relacionamento e recorrência</p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Dados demonstrativos</span>
          </div>
          <h1 className="mt-1 text-[34px] font-extrabold tracking-[-0.035em]">Clientes</h1>
          <p className="mt-1.5 text-sm text-slate-500">Histórico de compras, frequência, preferências e retorno de clientes.</p>
        </div>
        <Link to="/painel/pedidos" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600">
          <ShoppingBag className="h-4 w-4" /> Criar pedido
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          { icon: ContactRound, label: "Clientes", value: "126", note: "Base demonstrativa", tone: "bg-violet-50 text-violet-600" },
          { icon: Repeat2, label: "Recorrentes", value: "62%", note: recurringCount + " em destaque", tone: "bg-emerald-50 text-emerald-600" },
          { icon: ReceiptText, label: "Pedidos da base", value: String(totalOrders), note: "Somando clientes exibidos", tone: "bg-orange-50 text-orange-600" },
          { icon: WalletCards, label: "Ticket médio", value: "R$ 42,18", note: "Últimos 30 dias", tone: "bg-blue-50 text-blue-600" },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <PanelCard key={metric.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className={"grid h-11 w-11 place-items-center rounded-2xl " + metric.tone}><Icon className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">{metric.label}</div>
                  <div className="mt-0.5 text-xl font-extrabold">{metric.value}</div>
                  <div className="mt-0.5 text-[10px] font-semibold text-slate-400">{metric.note}</div>
                </div>
              </div>
            </PanelCard>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1.45fr)_minmax(320px,.55fr)] gap-4">
        <PanelCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-extrabold">Base de clientes</h2>
              <p className="mt-1 text-xs text-slate-400">{filtered.length} clientes exibidos</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-500">
              <Search className="h-3.5 w-3.5" /> Histórico disponível
            </div>
          </div>

          <table className="w-full min-w-[900px] text-left text-xs">
            <thead className="bg-slate-50 text-slate-400">
              <tr><th className="px-5 py-3">Cliente</th><th>Bairro</th><th>Pedidos</th><th>Total gasto</th><th>Último pedido</th><th>Perfil</th><th className="pr-5 text-right">Ação</th></tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-amber-300 text-xs font-extrabold text-white">
                        {customer.name.split(" ").slice(0,2).map((part)=>part[0]).join("")}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">{customer.name}</div>
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><Phone className="h-3 w-3" />{customer.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td><div className="flex items-center gap-1.5 font-semibold text-slate-600"><MapPin className="h-3.5 w-3.5 text-slate-400" />{customer.neighborhood}</div></td>
                  <td className="font-extrabold">{customer.orders}</td>
                  <td className="font-extrabold">{customer.spent}</td>
                  <td className="text-slate-500">{customer.lastOrder}</td>
                  <td>
                    <span className={"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold " + (customer.recurring ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                      {customer.recurring ? <Repeat2 className="h-3 w-3" /> : <UserRoundCheck className="h-3 w-3" />}
                      {customer.recurring ? "Recorrente" : "Ocasional"}
                    </span>
                  </td>
                  <td className="pr-5 text-right">
                    <button type="button" onClick={() => setSelected(customer)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-[11px] font-extrabold text-slate-600 hover:border-orange-200 hover:text-orange-600">
                      Ver histórico <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PanelCard>

        <div className="space-y-4">
          <PanelCard className="p-5">
            <div className="flex items-center gap-2"><Crown className="h-5 w-5 text-orange-500" /><h2 className="font-extrabold">Clientes que mais compram</h2></div>
            <div className="mt-5 space-y-3">
              {customers.slice().sort((a,b)=>b.orders-a.orders).slice(0,4).map((customer,index)=>(
                <button key={customer.id} type="button" onClick={()=>setSelected(customer)} className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 p-3 text-left transition hover:border-orange-100 hover:bg-orange-50/30">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-orange-50 text-[10px] font-extrabold text-orange-600">{index+1}</span>
                  <div className="min-w-0 flex-1"><div className="truncate text-xs font-extrabold">{customer.name}</div><div className="mt-1 text-[10px] text-slate-400">{customer.orders} pedidos</div></div>
                  <div className="text-xs font-extrabold">{customer.spent}</div>
                </button>
              ))}
            </div>
          </PanelCard>

          <PanelCard className="p-5">
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-orange-500" /><h2 className="font-extrabold">Oportunidades</h2></div>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-emerald-50 p-4"><div className="text-xs font-extrabold text-emerald-800">23 clientes</div><p className="mt-1 text-[10px] leading-5 text-emerald-700">Já fizeram 3 ou mais pedidos no último mês.</p></div>
              <div className="rounded-2xl bg-amber-50 p-4"><div className="text-xs font-extrabold text-amber-800">17 clientes</div><p className="mt-1 text-[10px] leading-5 text-amber-700">Estão há mais de 30 dias sem comprar.</p></div>
              <div className="rounded-2xl bg-blue-50 p-4"><div className="text-xs font-extrabold text-blue-800">Pastel + bebida</div><p className="mt-1 text-[10px] leading-5 text-blue-700">É a combinação mais repetida na base demonstrativa.</p></div>
            </div>
          </PanelCard>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-950/30 backdrop-blur-sm">
          <div className="h-full w-full max-w-[560px] overflow-y-auto bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-amber-300 text-sm font-extrabold text-white">
                  {selected.name.split(" ").slice(0,2).map((part)=>part[0]).join("")}
                </div>
                <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-500">Perfil do cliente</p><h2 className="mt-1 text-xl font-extrabold">{selected.name}</h2></div>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 p-2 text-slate-500"><X className="h-4 w-4" /></button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4"><div className="text-[10px] font-bold text-slate-400">Pedidos</div><div className="mt-1 text-xl font-extrabold">{selected.orders}</div></div>
              <div className="rounded-2xl bg-slate-50 p-4"><div className="text-[10px] font-bold text-slate-400">Total gasto</div><div className="mt-1 text-xl font-extrabold">{selected.spent}</div></div>
              <div className="rounded-2xl bg-slate-50 p-4"><div className="text-[10px] font-bold text-slate-400">Ticket médio</div><div className="mt-1 text-xl font-extrabold">{selected.average}</div></div>
            </div>

            <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-orange-800"><Sparkles className="h-4 w-4" /> Preferência mais frequente</div>
              <div className="mt-2 text-sm font-extrabold text-slate-900">{selected.favorite}</div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a href={"tel:" + selected.phone.replace(/\D/g,"")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-xs font-extrabold text-slate-700"><Phone className="h-4 w-4" /> Ligar</a>
              <a href={"https://wa.me/55" + selected.phone.replace(/\D/g,"")} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-3 text-xs font-extrabold text-white"><MessageCircleMore className="h-4 w-4" /> WhatsApp</a>
            </div>

            <div className="mt-7">
              <div className="flex items-center gap-2"><PackageCheck className="h-5 w-5 text-orange-500" /><h3 className="font-extrabold">Histórico de pedidos</h3></div>
              <div className="mt-4 space-y-3">
                {selected.ordersHistory.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-500"><ReceiptText className="h-4 w-4" /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2"><span className="text-xs font-extrabold">#{order.id}</span><span className={"rounded-full px-2 py-1 text-[9px] font-extrabold " + (order.status === "Concluído" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>{order.status}</span></div>
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><CalendarDays className="h-3 w-3" />{order.date}</div>
                        <div className="mt-3 space-y-1">{order.items.map((item)=><div key={item} className="text-[11px] font-semibold text-slate-600">{item}</div>)}</div>
                      </div>
                      <div className="text-sm font-extrabold">{order.total}</div>
                    </div>
                    <button type="button" onClick={() => simulateRepeat(order.id)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-50 px-3 py-2.5 text-[10px] font-extrabold text-orange-600 hover:bg-orange-100">
                      <Repeat2 className="h-3.5 w-3.5" /> {repeatFeedback === order.id ? "Pedido copiado para a central ✓" : "Criar pedido igual"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 text-center text-[10px] leading-5 text-slate-400">A repetição do pedido é apenas uma interação de front-end nesta etapa.</p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
