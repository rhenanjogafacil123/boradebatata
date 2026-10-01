
import { createFileRoute } from "@tanstack/react-router";
import {
  Bike,
  Check,
  ChefHat,
  CircleDollarSign,
  PackageCheck,
  Plus,
  Settings2,
  ShoppingBag,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { DashboardShell, PanelCard } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/painel/pedidos")({
  component: OrdersDashboard,
  head: () => ({ meta: [{ title: "Central de Pedidos | Bora de Batata" }] }),
});

type Status = "recebido" | "preparando" | "pronto" | "entrega";

type Order = {
  id: number;
  customer: string;
  channel: string;
  items: string[];
  payment: string;
  price: string;
  minutes: number;
  status: Status;
};

const initialOrders: Order[] = [
  { id: 1048, customer: "João Silva", channel: "WhatsApp", items: ["1x Combo Batata Especial", "1x Refrigerante 2L"], payment: "Pix", price: "R$ 52,90", minutes: 2, status: "recebido" },
  { id: 1049, customer: "Mariana Costa", channel: "iFood", items: ["2x X-Bacon", "1x Molho Cheddar"], payment: "Cartão", price: "R$ 55,80", minutes: 6, status: "recebido" },
  { id: 1050, customer: "Carlos Ribeiro", channel: "Balcão", items: ["1x Batata Frita Grande", "1x Refrigerante"], payment: "Dinheiro", price: "R$ 28,50", minutes: 8, status: "recebido" },
  { id: 1045, customer: "Ana Paula", channel: "iFood", items: ["1x X-Tudo", "1x Batata Grande"], payment: "Cartão", price: "R$ 49,90", minutes: 12, status: "preparando" },
  { id: 1047, customer: "Lucas Mendes", channel: "WhatsApp", items: ["1x Combo Batata", "1x Refrigerante 2L"], payment: "Pix", price: "R$ 37,00", minutes: 15, status: "preparando" },
  { id: 1051, customer: "Fernanda Lima", channel: "Balcão", items: ["1x Batata Média", "1x Molho Cheddar"], payment: "Dinheiro", price: "R$ 33,50", minutes: 18, status: "preparando" },
  { id: 1046, customer: "Pedro Santos", channel: "WhatsApp", items: ["1x X-Bacon", "1x Refrigerante 2L"], payment: "Pix", price: "R$ 42,90", minutes: 5, status: "pronto" },
  { id: 1044, customer: "Juliana Alves", channel: "iFood", items: ["1x Batata Grande", "1x Molho Cheddar"], payment: "Cartão", price: "R$ 31,20", minutes: 8, status: "pronto" },
  { id: 1042, customer: "Amanda Rocha", channel: "Delivery", items: ["1x X-Tudo", "1x Batata Grande"], payment: "Cartão", price: "R$ 42,90", minutes: 8, status: "entrega" },
  { id: 1043, customer: "Gabriel Martins", channel: "Delivery", items: ["1x Combo Batata", "1x Refrigerante 2L"], payment: "Pix", price: "R$ 52,00", minutes: 12, status: "entrega" },
];

const columns: { status: Status; title: string; dot: string; action: string; button: string }[] = [
  { status: "recebido", title: "Recebido", dot: "bg-slate-400", action: "Confirmar pedido", button: "bg-emerald-500 text-white hover:bg-emerald-600" },
  { status: "preparando", title: "Preparando", dot: "bg-amber-400", action: "Marcar pronto", button: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
  { status: "pronto", title: "Pronto", dot: "bg-emerald-500", action: "Atribuir motoboy", button: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { status: "entrega", title: "Em entrega", dot: "bg-blue-500", action: "Finalizar", button: "bg-slate-900 text-white hover:bg-slate-800" },
];

const soldOutSeed = ["Batata Frita Grande", "X-Calabresa", "Molho Cheddar"];

function OrdersDashboard() {
  const [orders, setOrders] = useState(initialOrders);
  const [manualOpen, setManualOpen] = useState(false);
  const [soldOut, setSoldOut] = useState(soldOutSeed);

  const grouped = useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        orders: orders.filter((order) => order.status === column.status),
      })),
    [orders],
  );

  function advance(order: Order) {
    const next: Record<Status, Status | null> = {
      recebido: "preparando",
      preparando: "pronto",
      pronto: "entrega",
      entrega: null,
    };
    const target = next[order.status];
    setOrders((current) =>
      target
        ? current.map((item) => (item.id === order.id ? { ...item, status: target, minutes: 0 } : item))
        : current.filter((item) => item.id !== order.id),
    );
  }

  function createManualOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const customer = String(data.get("customer") || "Cliente");
    const item = String(data.get("item") || "Pedido manual");
    const priceRaw = String(data.get("price") || "0,00");
    const nextId = Math.max(...orders.map((order) => order.id), 1050) + 1;

    setOrders((current) => [
      {
        id: nextId,
        customer,
        channel: "Balcão",
        items: ["1x " + item],
        payment: "Pix",
        price: priceRaw.startsWith("R$") ? priceRaw : "R$ " + priceRaw,
        minutes: 0,
        status: "recebido",
      },
      ...current,
    ]);
    setManualOpen(false);
  }

  return (
    <DashboardShell active="pedidos" role="Atendente" name="Camila Oliveira">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-500">Operação em tempo real</p>
          <h1 className="mt-1 text-[34px] font-extrabold tracking-[-0.035em]">Central de Pedidos</h1>
          <p className="mt-1.5 text-sm text-slate-500">Confirme, prepare, despache e acompanhe cada pedido sem sair desta tela.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 shadow-sm">
            <Settings2 className="h-4 w-4" /> Configurar Kanban
          </button>
          <button
            type="button"
            onClick={() => setManualOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" /> Criar pedido manual
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          [ShoppingBag, "Novos pedidos", grouped[0].orders.length, "Entraram agora", "bg-emerald-50 text-emerald-600"],
          [ChefHat, "Em preparo", grouped[1].orders.length, "Na cozinha", "bg-orange-50 text-orange-600"],
          [PackageCheck, "Prontos", grouped[2].orders.length, "Aguardando saída", "bg-violet-50 text-violet-600"],
          [Bike, "Em entrega", grouped[3].orders.length, "Com motoboy", "bg-blue-50 text-blue-600"],
        ].map(([Icon, label, value, note, tone]) => {
          const MetricIcon = Icon as typeof ShoppingBag;
          return (
            <PanelCard key={String(label)} className="p-4">
              <div className="flex items-center gap-3">
                <div className={"grid h-11 w-11 place-items-center rounded-2xl " + String(tone)}>
                  <MetricIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">{String(label)}</div>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold">{String(value)}</span>
                    <span className="text-[10px] font-semibold text-slate-400">{String(note)}</span>
                  </div>
                </div>
              </div>
            </PanelCard>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4">
        {grouped.map((column) => (
          <PanelCard key={column.status} className="overflow-hidden">
            <div className="flex items-center border-b border-slate-100 px-4 py-3.5">
              <span className={"mr-2 h-2.5 w-2.5 rounded-full " + column.dot} />
              <h2 className="text-sm font-extrabold">{column.title}</h2>
              <span className="ml-1 text-xs font-bold text-slate-400">({column.orders.length})</span>
              <button type="button" className="ml-auto rounded-lg px-2 py-1 text-[10px] font-bold text-slate-400 hover:bg-slate-50">
                Ordenar ▾
              </button>
            </div>

            <div className="min-h-[470px] space-y-3 bg-slate-50/65 p-3">
              {column.orders.map((order) => (
                <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-extrabold">#{order.id}</div>
                      <div className="mt-1 text-sm font-extrabold">{order.customer}</div>
                    </div>
                    <div className={"text-[10px] font-extrabold " + (order.status === "entrega" ? "text-blue-500" : "text-red-500")}>
                      {order.status === "entrega" ? "Saiu há " : "Há "}{order.minutes} min
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                    <Store className="h-3.5 w-3.5" /> {order.channel}
                  </div>

                  <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-[11px] leading-5 text-slate-600">
                    {order.items.map((item) => <div key={item}>{item}</div>)}
                  </div>

                  <div className="mt-3 flex items-center text-xs">
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <CircleDollarSign className="h-3.5 w-3.5" />{order.payment}
                    </span>
                    <span className="ml-auto font-extrabold">{order.price}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => advance(order)}
                    className={"mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-extrabold transition " + column.button}
                  >
                    {order.status === "recebido" || order.status === "preparando" ? (
                      <Check className="h-4 w-4" />
                    ) : order.status === "pronto" ? (
                      <Bike className="h-4 w-4" />
                    ) : (
                      <PackageCheck className="h-4 w-4" />
                    )}
                    {column.action}
                  </button>
                </article>
              ))}
              {column.orders.length === 0 && (
                <div className="grid min-h-36 place-items-center rounded-2xl border border-dashed border-slate-200 bg-white text-center text-xs font-semibold text-slate-400">
                  Nenhum pedido nesta etapa.
                </div>
              )}
            </div>
          </PanelCard>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <PanelCard className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bike className="h-5 w-5 text-orange-500" />
              <h2 className="font-extrabold">Motoboys disponíveis</h2>
            </div>
            <button type="button" className="text-[10px] font-extrabold text-orange-600">Ver todos</button>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {[
              ["Rafael Lima", "Disponível", "12 entregas hoje", "green"],
              ["Diego Souza", "Disponível", "8 entregas hoje", "green"],
              ["Matheus Alves", "Em entrega", "9 entregas hoje", "amber"],
              ["Bruno Costa", "Disponível", "6 entregas hoje", "green"],
            ].map(([name, status, deliveries, tone]) => (
              <div key={name} className="flex items-center gap-3 py-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100">
                  <UserRound className="h-4 w-4 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold">{name}</div>
                  <div className={"mt-1 text-[10px] font-semibold " + (tone === "green" ? "text-emerald-600" : "text-amber-600")}>
                    ● {status}
                  </div>
                </div>
                <div className="text-[10px] font-semibold text-slate-400">{deliveries}</div>
                <button type="button" className="rounded-lg bg-blue-50 px-3 py-2 text-[10px] font-extrabold text-blue-600">
                  {status === "Disponível" ? "Atribuir" : "Ver rota"}
                </button>
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-orange-500" />
              <h2 className="font-extrabold">Produtos esgotados</h2>
            </div>
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-extrabold text-red-600">{soldOut.length} itens</span>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {soldOut.map((name) => (
              <div key={name} className="flex items-center gap-3 py-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-xl">🍟</div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold">{name}</div>
                  <div className="mt-1 text-[10px] text-slate-400">Indisponível para novos pedidos</div>
                </div>
                <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-extrabold text-red-600">Esgotado</span>
                <button
                  type="button"
                  onClick={() => setSoldOut((items) => items.filter((item) => item !== name))}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-extrabold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Repor
                </button>
              </div>
            ))}
            {soldOut.length === 0 && (
              <div className="py-8 text-center text-xs font-semibold text-emerald-600">Todos os produtos estão disponíveis.</div>
            )}
          </div>
        </PanelCard>
      </div>

      {manualOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/35 p-6 backdrop-blur-sm">
          <form onSubmit={createManualOrder} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Novo pedido manual</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Cadastre rapidamente um pedido feito no balcão ou telefone.</p>
              </div>
              <button type="button" onClick={() => setManualOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Cliente</span>
                <input name="customer" required className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" placeholder="Nome do cliente" />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Item principal</span>
                <input name="item" required className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" placeholder="Ex.: Batata grande com cheddar" />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Valor</span>
                <input name="price" required className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" placeholder="39,90" />
              </label>
            </div>

            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setManualOpen(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-extrabold text-slate-600">
                Cancelar
              </button>
              <button type="submit" className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-orange-600">
                Criar pedido
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardShell>
  );
}
