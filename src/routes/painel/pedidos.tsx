
import { createFileRoute } from "@tanstack/react-router";
import {
  Bike,
  Check,
  ChefHat,
  CircleDollarSign,
  Clock3,
  FileText,
  MapPin,
  MessageSquareText,
  PackageCheck,
  Pencil,
  Phone,
  Plus,
  Printer,
  ReceiptText,
  Settings2,
  ShoppingBag,
  Store,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { DashboardShell, PanelCard } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/painel/pedidos")({
  component: OrdersDashboard,
  head: () => ({
    meta: [
      { title: "Central de Pedidos | Bora de Batata" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
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
  courier?: string;
  phone?: string;
  address?: string;
  neighborhood?: string;
  notes?: string;
  createdAt?: string;
};

const initialOrders: Order[] = [
  { id: 1048, customer: "João Silva", channel: "WhatsApp", items: ["1x Carne moída com cheddar • 500g", "1x Refrigerante lata"], payment: "Pix", price: "R$ 52,90", minutes: 2, status: "recebido", phone: "(21) 99142-7730", address: "Rua das Flores, 123", neighborhood: "Santa Cruz", notes: "Sem cebola. Enviar molho separado.", createdAt: "14:32" },
  { id: 1049, customer: "Mariana Costa", channel: "iFood", items: ["2x Bacon com cheddar • 300g"], payment: "Cartão", price: "R$ 55,80", minutes: 6, status: "recebido", phone: "(21) 98821-4452", address: "Estrada do Mendanha, 840", neighborhood: "Campo Grande", notes: "Interfone 204.", createdAt: "14:28" },
  { id: 1050, customer: "Carlos Ribeiro", channel: "Balcão", items: ["1x Strogonoff de frango • 500g", "1x Guaracamp"], payment: "Dinheiro", price: "R$ 28,50", minutes: 8, status: "recebido", phone: "(21) 98044-5012", neighborhood: "Paciência", notes: "Retirada no balcão.", createdAt: "14:22" },
  { id: 1045, customer: "Ana Paula", channel: "iFood", items: ["1x Pastel com tudo dentro", "1x Refrigerante lata"], payment: "Cartão", price: "R$ 49,90", minutes: 12, status: "preparando", phone: "(21) 97420-1188", address: "Rua Silva Cardoso, 91", neighborhood: "Bangu", notes: "Retirar uva-passa e azeitona.", createdAt: "14:12" },
  { id: 1047, customer: "Lucas Mendes", channel: "WhatsApp", items: ["1x Calabresa com cheddar • 500g", "1x Refrigerante lata"], payment: "Pix", price: "R$ 37,00", minutes: 15, status: "preparando", phone: "(21) 98211-8301", address: "Rua Piraquara, 557", neighborhood: "Realengo", createdAt: "14:09" },
  { id: 1051, customer: "Fernanda Lima", channel: "Balcão", items: ["1x Bacon com catupiry • 300g"], payment: "Dinheiro", price: "R$ 33,50", minutes: 18, status: "preparando", phone: "(21) 99763-9120", neighborhood: "Senador Camará", notes: "Troco para R$ 50.", createdAt: "14:05" },
  { id: 1046, customer: "Pedro Santos", channel: "WhatsApp", items: ["1x Carne moída com catupiry • 500g", "1x Guaracamp"], payment: "Pix", price: "R$ 42,90", minutes: 5, status: "pronto", phone: "(21) 99280-1477", address: "Rua Felipe Cardoso, 303", neighborhood: "Santa Cruz", createdAt: "13:58" },
  { id: 1044, customer: "Juliana Alves", channel: "iFood", items: ["1x Calabresa com catupiry • 500g"], payment: "Cartão", price: "R$ 31,20", minutes: 8, status: "pronto", phone: "(21) 97331-6009", address: "Av. Santa Cruz, 1902", neighborhood: "Bangu", createdAt: "13:51" },
  { id: 1042, customer: "Amanda Rocha", channel: "Delivery", items: ["1x Pastel montável", "1x Refrigerante lata"], payment: "Cartão", price: "R$ 42,90", minutes: 8, status: "entrega", courier: "Matheus Alves", phone: "(21) 99812-3381", address: "Rua das Acácias, 321", neighborhood: "Campo Grande", notes: "Casa com portão branco.", createdAt: "13:40" },
  { id: 1043, customer: "Gabriel Martins", channel: "Delivery", items: ["1x Strogonoff de frango • 500g", "1x Refrigerante lata"], payment: "Pix", price: "R$ 52,00", minutes: 12, status: "entrega", courier: "Rafael Lima", phone: "(21) 97642-2230", address: "Rua Pioneiros, 789", neighborhood: "Realengo", createdAt: "13:34" },
];

const columns: { status: Status; title: string; dot: string; action: string; button: string }[] = [
  { status: "recebido", title: "Recebido", dot: "bg-slate-400", action: "Confirmar pedido", button: "bg-emerald-500 text-white hover:bg-emerald-600" },
  { status: "preparando", title: "Preparando", dot: "bg-amber-400", action: "Marcar pronto", button: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
  { status: "pronto", title: "Pronto", dot: "bg-emerald-500", action: "Atribuir motoboy", button: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { status: "entrega", title: "Em entrega", dot: "bg-blue-500", action: "Finalizar", button: "bg-slate-900 text-white hover:bg-slate-800" },
];

const couriers = [
  { name: "Rafael Lima", status: "Disponível", deliveries: "12 entregas hoje", tone: "green" },
  { name: "Diego Souza", status: "Disponível", deliveries: "8 entregas hoje", tone: "green" },
  { name: "Matheus Alves", status: "Em entrega", deliveries: "9 entregas hoje", tone: "amber" },
  { name: "Bruno Costa", status: "Disponível", deliveries: "6 entregas hoje", tone: "green" },
];

const soldOutSeed = ["Bacon com cheddar • 500g", "Pastel com tudo dentro", "Guaracamp"];

function OrdersDashboard() {
  const [orders, setOrders] = useState(initialOrders);
  const [manualOpen, setManualOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);
  const [soldOut, setSoldOut] = useState(soldOutSeed);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleStatuses, setVisibleStatuses] = useState<Status[]>(["recebido", "preparando", "pronto", "entrega"]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [receiptOrderId, setReceiptOrderId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase("pt-BR");
    if (!query) return orders;
    return orders.filter((order) =>
      [
        String(order.id),
        order.customer,
        order.channel,
        order.payment,
        order.price,
        order.courier ?? "",
        ...order.items,
      ]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(query),
    );
  }, [orders, searchTerm]);

  const grouped = useMemo(
    () =>
      columns
        .filter((column) => visibleStatuses.includes(column.status))
        .map((column) => ({
          ...column,
          orders: filteredOrders.filter((order) => order.status === column.status),
        })),
    [filteredOrders, visibleStatuses],
  );

  const selectedOrder = selectedOrderId == null ? null : orders.find((order) => order.id === selectedOrderId) ?? null;
  const editingOrder = editingOrderId == null ? null : orders.find((order) => order.id === editingOrderId) ?? null;
  const receiptOrder = receiptOrderId == null ? null : orders.find((order) => order.id === receiptOrderId) ?? null;

  const counts = useMemo(
    () => ({
      recebido: orders.filter((order) => order.status === "recebido").length,
      preparando: orders.filter((order) => order.status === "preparando").length,
      pronto: orders.filter((order) => order.status === "pronto").length,
      entrega: orders.filter((order) => order.status === "entrega").length,
    }),
    [orders],
  );

  function advance(order: Order) {
    if (order.status === "pronto") {
      setAssigningOrder(order);
      return;
    }

    const next: Record<Exclude<Status, "pronto">, Status | null> = {
      recebido: "preparando",
      preparando: "pronto",
      entrega: null,
    };
    const target = next[order.status as Exclude<Status, "pronto">];
    setOrders((current) =>
      target
        ? current.map((item) => (item.id === order.id ? { ...item, status: target, minutes: 0 } : item))
        : current.filter((item) => item.id !== order.id),
    );
  }

  function assignCourier(name: string) {
    if (!assigningOrder) return;
    setOrders((current) =>
      current.map((item) =>
        item.id === assigningOrder.id
          ? { ...item, status: "entrega", channel: "Delivery", courier: name, minutes: 0 }
          : item,
      ),
    );
    setAssigningOrder(null);
  }

  function toggleStatus(status: Status) {
    setVisibleStatuses((current) => {
      if (current.includes(status)) {
        if (current.length === 1) return current;
        return current.filter((item) => item !== status);
      }
      return columns.map((column) => column.status).filter((item) => [...current, status].includes(item));
    });
  }

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2200);
  }

  function cancelOrder(order: Order) {
    setOrders((current) => current.filter((item) => item.id !== order.id));
    setSelectedOrderId(null);
    showFeedback("Pedido #" + order.id + " cancelado no modo demonstrativo.");
  }

  function saveOrderItems(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingOrder) return;

    const data = new FormData(event.currentTarget);
    const items = String(data.get("items") || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const notes = String(data.get("notes") || "").trim();
    const payment = String(data.get("payment") || editingOrder.payment);
    const price = String(data.get("price") || editingOrder.price).trim();

    if (items.length === 0) return;

    setOrders((current) =>
      current.map((order) =>
        order.id === editingOrder.id
          ? {
              ...order,
              items,
              notes,
              payment,
              price: price.startsWith("R$") ? price : "R$ " + price,
            }
          : order,
      ),
    );
    setEditingOrderId(null);
    showFeedback("Pedido #" + editingOrder.id + " atualizado.");
  }

  function createManualOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const customer = String(data.get("customer") || "Cliente");
    const item = String(data.get("item") || "Pedido manual");
    const priceRaw = String(data.get("price") || "0,00");
    const payment = String(data.get("payment") || "Pix");
    const channel = String(data.get("channel") || "Balcão");
    const nextId = Math.max(...orders.map((order) => order.id), 1050) + 1;

    setOrders((current) => [
      {
        id: nextId,
        customer,
        channel,
        items: ["1x " + item],
        payment,
        price: priceRaw.startsWith("R$") ? priceRaw : "R$ " + priceRaw,
        minutes: 0,
        status: "recebido",
        phone: "Não informado",
        address: channel === "Balcão" ? "Retirada no balcão" : "Endereço a definir",
        neighborhood: "A definir",
        notes: "Pedido criado manualmente.",
        createdAt: "Agora",
      },
      ...current,
    ]);
    setManualOpen(false);
  }

  return (
    <DashboardShell
      active="pedidos"
      role="Atendente"
      name="Camila Oliveira"
      search={{
        value: searchTerm,
        onChange: setSearchTerm,
        placeholder: "Buscar por pedido, cliente, item, pagamento ou motoboy...",
      }}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-500">Operação em tempo real</p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Dados demonstrativos</span>
          </div>
          <h1 className="mt-1 text-[34px] font-extrabold tracking-[-0.035em]">Central de Pedidos</h1>
          <p className="mt-1.5 text-sm text-slate-500">Confirme, prepare, despache e acompanhe cada pedido sem sair desta tela.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setConfigOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 shadow-sm">
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
          [ShoppingBag, "Novos pedidos", counts.recebido, "Entraram agora", "bg-emerald-50 text-emerald-600"],
          [ChefHat, "Em preparo", counts.preparando, "Na cozinha", "bg-orange-50 text-orange-600"],
          [PackageCheck, "Prontos", counts.pronto, "Aguardando saída", "bg-violet-50 text-violet-600"],
          [Bike, "Em entrega", counts.entrega, "Com motoboy", "bg-blue-50 text-blue-600"],
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

      {searchTerm.trim() && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
          <span><strong>{filteredOrders.length}</strong> pedido(s) encontrado(s) para “{searchTerm}”.</span>
          <button type="button" onClick={() => setSearchTerm("")} className="font-extrabold">Limpar busca</button>
        </div>
      )}

      <div
        className="mt-4 grid gap-4"
        style={{ gridTemplateColumns: "repeat(" + Math.max(grouped.length, 1) + ", minmax(0, 1fr))" }}
      >
        {grouped.map((column) => (
          <PanelCard key={column.status} className="overflow-hidden">
            <div className="flex items-center border-b border-slate-100 px-4 py-3.5">
              <span className={"mr-2 h-2.5 w-2.5 rounded-full " + column.dot} />
              <h2 className="text-sm font-extrabold">{column.title}</h2>
              <span className="ml-1 text-xs font-bold text-slate-400">({column.orders.length})</span>
              <span className="ml-auto text-[10px] font-bold text-slate-300">Mais antigos</span>
            </div>

            <div className="max-h-[620px] min-h-[470px] space-y-3 overflow-y-auto bg-slate-50/65 p-3">
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
                    {order.courier && <span className="ml-auto text-blue-500">🛵 {order.courier}</span>}
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
                    onClick={() => setSelectedOrderId(order.id)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-extrabold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <ReceiptText className="h-3.5 w-3.5" /> Ver detalhes
                  </button>

                  <button
                    type="button"
                    onClick={() => advance(order)}
                    className={"mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-extrabold transition " + column.button}
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
            <span className="text-[10px] font-extrabold text-slate-400">Atualização visual</span>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {couriers.map(({ name, status, deliveries, tone }) => (
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
                <img src="/bora-hero.png" alt="" className="h-10 w-10 rounded-xl bg-orange-50 object-cover" />
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

      {feedback && (
        <div className="fixed bottom-6 right-6 z-[120] rounded-2xl bg-slate-950 px-4 py-3 text-xs font-extrabold text-white shadow-2xl">
          {feedback}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-[85] flex justify-end bg-slate-950/35 backdrop-blur-sm">
          <div className="h-full w-full max-w-[590px] overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                  <ReceiptText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-500">Detalhes do pedido</div>
                  <div className="mt-1 flex items-center gap-2">
                    <h2 className="text-xl font-extrabold">#{selectedOrder.id}</h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold text-slate-500">{columns.find((item) => item.status === selectedOrder.status)?.title}</span>
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedOrderId(null)} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <PanelCard className="p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-amber-300 text-xs font-extrabold text-white">
                    {selectedOrder.customer.split(" ").slice(0,2).map((part) => part[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold">{selectedOrder.customer}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400"><Phone className="h-3 w-3" />{selectedOrder.phone ?? "Não informado"}</div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold text-slate-500">{selectedOrder.channel}</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400"><MapPin className="h-3.5 w-3.5" /> Endereço</div>
                    <div className="mt-2 text-xs font-extrabold leading-5">{selectedOrder.address ?? "Endereço não informado"}</div>
                    <div className="mt-1 text-[10px] text-slate-400">{selectedOrder.neighborhood ?? "Bairro não informado"}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400"><Clock3 className="h-3.5 w-3.5" /> Entrada</div>
                    <div className="mt-2 text-xs font-extrabold">{selectedOrder.createdAt ?? "Agora"}</div>
                    <div className="mt-1 text-[10px] text-slate-400">Há {selectedOrder.minutes} min nesta etapa</div>
                  </div>
                </div>
              </PanelCard>

              <PanelCard className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><PackageCheck className="h-5 w-5 text-orange-500" /><h3 className="font-extrabold">Itens do pedido</h3></div>
                  <button type="button" onClick={() => setEditingOrderId(selectedOrder.id)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-extrabold text-slate-600 hover:border-orange-200 hover:text-orange-600">
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </button>
                </div>
                <div className="mt-4 space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item} className="rounded-xl bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-700">{item}</div>
                  ))}
                </div>
                <div className="mt-4 flex items-center border-t border-slate-100 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500"><CircleDollarSign className="h-4 w-4" />{selectedOrder.payment}</span>
                  <span className="ml-auto text-lg font-extrabold">{selectedOrder.price}</span>
                </div>
              </PanelCard>

              <PanelCard className="p-5">
                <div className="flex items-center gap-2"><MessageSquareText className="h-5 w-5 text-orange-500" /><h3 className="font-extrabold">Observações</h3></div>
                <p className="mt-3 rounded-2xl bg-amber-50 p-4 text-xs font-semibold leading-6 text-amber-900">{selectedOrder.notes || "Nenhuma observação neste pedido."}</p>
              </PanelCard>

              <PanelCard className="p-5">
                <div className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-orange-500" /><h3 className="font-extrabold">Linha do tempo</h3></div>
                <div className="mt-5 space-y-0">
                  {[
                    ["recebido", "Pedido recebido", "Entrou na central"],
                    ["preparando", "Em preparo", "Cozinha preparando"],
                    ["pronto", "Pedido pronto", "Aguardando saída"],
                    ["entrega", "Em entrega", selectedOrder.courier ? "Com " + selectedOrder.courier : "Aguardando motoboy"],
                  ].map(([status, title, subtitle], index) => {
                    const orderIndex = ["recebido", "preparando", "pronto", "entrega"].indexOf(selectedOrder.status);
                    const done = index <= orderIndex;
                    return (
                      <div key={status} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className={"grid h-7 w-7 place-items-center rounded-full text-[10px] font-extrabold " + (done ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400")}>{done ? "✓" : index + 1}</span>
                          {index < 3 && <span className={"h-9 w-px " + (index < orderIndex ? "bg-orange-300" : "bg-slate-200")} />}
                        </div>
                        <div className="pt-1">
                          <div className={"text-xs font-extrabold " + (done ? "text-slate-900" : "text-slate-400")}>{title}</div>
                          <div className="mt-1 text-[10px] text-slate-400">{subtitle}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </PanelCard>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setReceiptOrderId(selectedOrder.id)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-extrabold text-slate-700 hover:border-orange-200">
                  <Printer className="h-4 w-4" /> Comprovante
                </button>
                <button type="button" onClick={() => setEditingOrderId(selectedOrder.id)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-extrabold text-slate-700 hover:border-orange-200">
                  <Pencil className="h-4 w-4" /> Editar pedido
                </button>
              </div>

              <button type="button" onClick={() => cancelOrder(selectedOrder)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-extrabold text-rose-700 hover:bg-rose-100">
                <Trash2 className="h-4 w-4" /> Cancelar pedido
              </button>
              <p className="text-center text-[10px] leading-5 text-slate-400">Ações desta tela continuam demonstrativas até a etapa de integração.</p>
            </div>
          </div>
        </div>
      )}

      {editingOrder && (
        <div className="fixed inset-0 z-[105] grid place-items-center bg-slate-950/45 p-6 backdrop-blur-sm">
          <form onSubmit={saveOrderItems} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-500">Editar pedido</div><h2 className="mt-1 text-xl font-extrabold">#{editingOrder.id} • {editingOrder.customer}</h2></div>
              <button type="button" onClick={() => setEditingOrderId(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Itens — um por linha</span>
                <textarea name="items" rows={6} defaultValue={editingOrder.items.join("\n")} className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Observações</span>
                <textarea name="notes" rows={3} defaultValue={editingOrder.notes ?? ""} className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="text-xs font-extrabold text-slate-700">Pagamento</span><select name="payment" defaultValue={editingOrder.payment} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Pix</option><option>Cartão</option><option>Dinheiro</option></select></label>
                <label className="block"><span className="text-xs font-extrabold text-slate-700">Valor</span><input name="price" defaultValue={editingOrder.price} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></label>
              </div>
            </div>
            <div className="mt-6 flex gap-2"><button type="button" onClick={() => setEditingOrderId(null)} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-extrabold text-slate-600">Voltar</button><button type="submit" className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white">Salvar alterações</button></div>
          </form>
        </div>
      )}

      {receiptOrder && (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/50 p-6 backdrop-blur-sm">
          <div className="w-full max-w-[410px] rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-500">Comprovante visual</div><h2 className="mt-1 text-xl font-extrabold">Pedido #{receiptOrder.id}</h2></div>
              <button type="button" onClick={() => setReceiptOrderId(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 font-mono text-[11px] leading-6 text-slate-700">
              <div className="text-center">
                <img src="/bora-logo.svg" alt="" className="mx-auto h-10 w-10" />
                <div className="mt-2 font-bold">BORA DE BATATA</div>
                <div>Pedido #{receiptOrder.id} • {receiptOrder.createdAt ?? "Agora"}</div>
              </div>
              <div className="my-4 border-t border-dashed border-slate-300" />
              <div><strong>Cliente:</strong> {receiptOrder.customer}</div>
              <div><strong>Pagamento:</strong> {receiptOrder.payment}</div>
              <div><strong>Canal:</strong> {receiptOrder.channel}</div>
              <div className="my-4 border-t border-dashed border-slate-300" />
              {receiptOrder.items.map((item) => <div key={item}>{item}</div>)}
              <div className="my-4 border-t border-dashed border-slate-300" />
              <div className="flex justify-between text-sm font-bold"><span>TOTAL</span><span>{receiptOrder.price}</span></div>
              {receiptOrder.notes && <><div className="my-4 border-t border-dashed border-slate-300" /><div><strong>Obs:</strong> {receiptOrder.notes}</div></>}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setReceiptOrderId(null)} className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-extrabold text-slate-600">Fechar</button>
              <button type="button" onClick={() => showFeedback("Comprovante enviado para impressão (simulação).")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-extrabold text-white"><Printer className="h-4 w-4" /> Imprimir</button>
            </div>
          </div>
        </div>
      )}

      {manualOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/35 p-6 backdrop-blur-sm">
          <form onSubmit={createManualOrder} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Novo pedido manual</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Cadastre rapidamente um pedido feito no balcão, telefone ou WhatsApp.</p>
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
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-extrabold text-slate-700">Canal</span>
                  <select name="channel" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-300">
                    <option>Balcão</option>
                    <option>WhatsApp</option>
                    <option>Telefone</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-extrabold text-slate-700">Pagamento</span>
                  <select name="payment" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-300">
                    <option>Pix</option>
                    <option>Cartão</option>
                    <option>Dinheiro</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Valor</span>
                <input name="price" required inputMode="decimal" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" placeholder="39,90" />
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

      {configOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/35 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Configurar Kanban</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Escolha quais etapas quer visualizar. Pelo menos uma deve ficar ativa.</p>
              </div>
              <button type="button" onClick={() => setConfigOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 space-y-2">
              {columns.map((column) => {
                const active = visibleStatuses.includes(column.status);
                return (
                  <button
                    key={column.status}
                    type="button"
                    onClick={() => toggleStatus(column.status)}
                    className={"flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-bold transition " + (active ? "border-orange-200 bg-orange-50 text-orange-700" : "border-slate-200 bg-white text-slate-500")}
                  >
                    <span className={"h-2.5 w-2.5 rounded-full " + column.dot} />
                    <span className="flex-1">{column.title}</span>
                    <span className="text-xs">{active ? "Visível" : "Oculto"}</span>
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={() => setConfigOpen(false)} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-extrabold text-white">
              Concluir
            </button>
          </div>
        </div>
      )}

      {assigningOrder && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/35 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Atribuir motoboy</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Pedido #{assigningOrder.id} • {assigningOrder.customer}</p>
              </div>
              <button type="button" onClick={() => setAssigningOrder(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 space-y-2">
              {couriers.map((courier) => {
                const available = courier.status === "Disponível";
                return (
                  <button
                    key={courier.name}
                    type="button"
                    disabled={!available}
                    onClick={() => assignCourier(courier.name)}
                    className={"flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition " + (available ? "border-slate-200 hover:border-blue-200 hover:bg-blue-50" : "cursor-not-allowed border-slate-100 bg-slate-50 opacity-55")}
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100"><UserRound className="h-4 w-4 text-slate-500" /></div>
                    <div className="flex-1">
                      <div className="text-xs font-extrabold">{courier.name}</div>
                      <div className={"mt-1 text-[10px] font-semibold " + (available ? "text-emerald-600" : "text-amber-600")}>● {courier.status}</div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">{courier.deliveries}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
