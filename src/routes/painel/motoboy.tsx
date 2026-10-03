import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Bike,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  House,
  MapPin,
  MessageCircleMore,
  Navigation,
  PackageCheck,
  Phone,
  Route as RouteIcon,
  Store,
  TrendingUp,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/painel/motoboy")({
  component: MotoboyDashboard,
  head: () => ({
    meta: [
      { title: "Minhas Entregas | Bora de Batata" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type DeliveryStage = "retirada" | "a_caminho" | "cheguei";

type Delivery = {
  id: number;
  store: string;
  customer: string;
  phone: string;
  address: string;
  neighborhood: string;
  distance: string;
  fee: string;
  payment: string;
  minutes: number;
  image: string;
  items: string[];
  notes?: string;
  stage?: DeliveryStage;
};

type FinishedDelivery = Delivery & {
  deliveredAt: string;
};

const seedAvailable: Delivery[] = [
  {
    id: 1048,
    store: "Bora de Batata",
    customer: "João Silva",
    phone: "(21) 99142-7730",
    address: "Rua das Flores, 123",
    neighborhood: "Santa Cruz",
    distance: "2,1 km",
    fee: "R$ 8,50",
    payment: "Pix",
    minutes: 12,
    image: "/bora-hero.png",
    items: ["1x Carne moída com cheddar • 500g", "1x Refrigerante lata"],
    notes: "Sem cebola. Portão cinza.",
  },
  {
    id: 1049,
    store: "Bora de Batata",
    customer: "Mariana Costa",
    phone: "(21) 98821-4452",
    address: "Estrada do Mendanha, 840",
    neighborhood: "Campo Grande",
    distance: "3,4 km",
    fee: "R$ 7,00",
    payment: "Cartão",
    minutes: 15,
    image: "/bora-hero.png",
    items: ["2x Bacon com cheddar • 300g"],
    notes: "Interfone 204.",
  },
  {
    id: 1050,
    store: "Bora de Batata",
    customer: "Carlos Ribeiro",
    phone: "(21) 98044-5012",
    address: "Rua Pioneiros, 789",
    neighborhood: "Paciência",
    distance: "2,8 km",
    fee: "R$ 6,00",
    payment: "Dinheiro",
    minutes: 10,
    image: "/bora-hero.png",
    items: ["1x Strogonoff de frango • 500g", "1x Guaracamp"],
    notes: "Troco para R$ 50.",
  },
];

const seedActive: Delivery[] = [
  {
    id: 1045,
    store: "Bora de Batata",
    customer: "Ana Paula",
    phone: "(21) 97420-1188",
    address: "Rua das Acácias, 321",
    neighborhood: "Bangu",
    distance: "1,2 km",
    fee: "R$ 6,50",
    payment: "Pix",
    minutes: 8,
    image: "/bora-hero.png",
    items: ["1x Pastel com tudo dentro", "1x Refrigerante lata"],
    notes: "Casa com portão branco.",
    stage: "a_caminho",
  },
];

const seedHistory: FinishedDelivery[] = [
  {
    id: 1038,
    store: "Bora de Batata",
    customer: "Rafael Gomes",
    phone: "(21) 98001-2291",
    address: "Rua Limites, 44",
    neighborhood: "Realengo",
    distance: "2,4 km",
    fee: "R$ 8,00",
    payment: "Pix",
    minutes: 14,
    image: "/bora-hero.png",
    items: ["1x Carne moída com catupiry • 500g"],
    deliveredAt: "22:14",
  },
  {
    id: 1036,
    store: "Bora de Batata",
    customer: "Bianca Santos",
    phone: "(21) 99731-3302",
    address: "Av. Brasil, 4120",
    neighborhood: "Bangu",
    distance: "3,1 km",
    fee: "R$ 7,50",
    payment: "Cartão",
    minutes: 18,
    image: "/bora-hero.png",
    items: ["1x Pastel montável", "1x Guaracamp"],
    deliveredAt: "21:42",
  },
  {
    id: 1032,
    store: "Bora de Batata",
    customer: "Pedro Henrique",
    phone: "(21) 97570-9011",
    address: "Rua Oliveira Braga, 77",
    neighborhood: "Campo Grande",
    distance: "1,8 km",
    fee: "R$ 6,50",
    payment: "Dinheiro",
    minutes: 11,
    image: "/bora-hero.png",
    items: ["1x Strogonoff de frango • 300g"],
    deliveredAt: "20:58",
  },
  {
    id: 1029,
    store: "Bora de Batata",
    customer: "Larissa Melo",
    phone: "(21) 98111-4020",
    address: "Rua Amaral Costa, 210",
    neighborhood: "Santa Cruz",
    distance: "2,7 km",
    fee: "R$ 8,50",
    payment: "Pix",
    minutes: 16,
    image: "/bora-hero.png",
    items: ["1x Bacon com cheddar • 500g", "1x Refrigerante lata"],
    deliveredAt: "20:31",
  },
];

const stageMeta: Record<DeliveryStage, { label: string; button: string; next: string }> = {
  retirada: {
    label: "Retirar na loja",
    button: "Pedido retirado",
    next: "Confirme que pegou o pedido na loja.",
  },
  a_caminho: {
    label: "A caminho",
    button: "Cheguei no endereço",
    next: "Siga a rota e confirme quando chegar.",
  },
  cheguei: {
    label: "No endereço",
    button: "Confirmar entrega",
    next: "Entregue ao cliente e finalize.",
  },
};

function MotoboyDashboard() {
  const [online, setOnline] = useState(true);
  const [tab, setTab] = useState<"available" | "active" | "history">("available");
  const [available, setAvailable] = useState(seedAvailable);
  const [active, setActive] = useState<Delivery[]>(seedActive);
  const [history, setHistory] = useState<FinishedDelivery[]>(seedHistory);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const selected = useMemo(
    () =>
      active.find((item) => item.id === selectedId) ??
      available.find((item) => item.id === selectedId) ??
      history.find((item) => item.id === selectedId) ??
      null,
    [active, available, history, selectedId],
  );

  const todayEarnings = useMemo(() => {
    const values = [...history, ...active].map((item) =>
      Number(item.fee.replace("R$", "").replace(".", "").replace(",", ".").trim()),
    );
    return values.reduce((sum, value) => sum + value, 0);
  }, [history, active]);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2200);
  }

  function accept(delivery: Delivery) {
    if (!online) {
      showFeedback("Fique online para aceitar entregas.");
      return;
    }

    setAvailable((items) => items.filter((item) => item.id !== delivery.id));
    setActive((items) => [...items, { ...delivery, stage: "retirada" }]);
    setSelectedId(delivery.id);
    setTab("active");
    showFeedback("Entrega #" + delivery.id + " aceita.");
  }

  function advance(delivery: Delivery) {
    const stage = delivery.stage ?? "retirada";

    if (stage === "retirada") {
      setActive((items) =>
        items.map((item) =>
          item.id === delivery.id ? { ...item, stage: "a_caminho", minutes: 0 } : item,
        ),
      );
      showFeedback("Pedido retirado. Boa rota!");
      return;
    }

    if (stage === "a_caminho") {
      setActive((items) =>
        items.map((item) =>
          item.id === delivery.id ? { ...item, stage: "cheguei", minutes: 0 } : item,
        ),
      );
      showFeedback("Chegada registrada.");
      return;
    }

    const finished: FinishedDelivery = {
      ...delivery,
      stage: "cheguei",
      deliveredAt: "Agora",
    };

    setActive((items) => items.filter((item) => item.id !== delivery.id));
    setHistory((items) => [finished, ...items]);
    setSelectedId(null);
    setTab("history");
    showFeedback("Entrega #" + delivery.id + " concluída.");
  }

  return (
    <div className="min-h-screen bg-[#edf0f5] py-0 text-slate-950 sm:py-6">
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#f7f8fb] shadow-[0_24px_80px_-30px_rgba(15,23,42,.32)] sm:min-h-[calc(100vh-48px)] sm:rounded-[30px]">
        <div className="px-4 pb-4 pt-4">
          <div className="flex items-center">
            <Link to="/painel" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm">
                <img src="/bora-logo.svg" alt="Bora de Batata" className="h-8 w-8 object-contain" />
              </div>
              <span className="text-xs font-extrabold">Bora de Batata</span>
            </Link>

            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setNotificationsOpen((value) => !value)}
                className="relative rounded-xl p-2.5 text-slate-500"
                aria-label="Notificações"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white">2</span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-11 z-50 w-[290px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <div className="text-xs font-extrabold">Notificações</div>
                    <div className="mt-1 text-[10px] text-slate-400">Atualizações da sua operação</div>
                  </div>
                  <button type="button" onClick={() => { setTab("available"); setNotificationsOpen(false); }} className="flex w-full gap-3 px-4 py-3 text-left hover:bg-slate-50">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                    <span><span className="block text-[11px] font-extrabold">3 entregas disponíveis</span><span className="mt-1 block text-[9px] leading-4 text-slate-400">Novos pedidos aguardando aceite.</span></span>
                  </button>
                  <button type="button" onClick={() => { setTab("active"); setNotificationsOpen(false); }} className="flex w-full gap-3 border-t border-slate-100 px-4 py-3 text-left hover:bg-slate-50">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    <span><span className="block text-[11px] font-extrabold">Entrega #1045 em andamento</span><span className="mt-1 block text-[9px] leading-4 text-slate-400">Rota estimada em poucos minutos.</span></span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-slate-800 to-slate-600 text-white"
            >
              <UserRound className="h-6 w-6" />
              <span className={"absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#f7f8fb] " + (online ? "bg-emerald-500" : "bg-slate-400")} />
            </button>
            <div>
              <div className="text-base font-extrabold">Lucas Mendes</div>
              <button type="button" onClick={() => setProfileOpen(true)} className="text-xs text-slate-400">Motoboy • ver perfil</button>
            </div>
            <button
              type="button"
              onClick={() => setOnline((value) => !value)}
              className={"ml-auto inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-extrabold transition " + (online ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500")}
            >
              <span className={"h-2.5 w-2.5 rounded-full " + (online ? "bg-emerald-500" : "bg-slate-400")} />
              {online ? "Online" : "Offline"}
            </button>
          </div>

          <div className="mt-6">
            <h1 className="text-[30px] font-extrabold tracking-[-0.035em]">Minhas Entregas</h1>
            <p className="mt-1 text-xs leading-5 text-slate-500">Aceite pedidos, siga as etapas da rota e acompanhe seus ganhos.</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              [WalletCards, "Disponíveis", String(available.length), "bg-orange-50 text-orange-600"],
              [Bike, "Em rota", String(active.length), "bg-blue-50 text-blue-600"],
              [CheckCircle2, "Concluídas", String(history.length), "bg-emerald-50 text-emerald-600"],
            ].map(([Icon, label, value, tone]) => {
              const MetricIcon = Icon as typeof Bike;
              return (
                <div key={String(label)} className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">
                  <div className={"grid h-9 w-9 place-items-center rounded-xl " + String(tone)}>
                    <MetricIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="mt-3 text-[10px] font-semibold text-slate-500">{String(label)}</div>
                  <div className="mt-0.5 text-lg font-extrabold">{String(value)}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-[1fr_1.08fr] gap-2.5">
            <button
              id="ganhos-motoboy"
              type="button"
              onClick={() => setTab("history")}
              className="rounded-2xl border border-slate-200/70 bg-white p-4 text-left shadow-sm"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="mt-3 text-[10px] font-semibold text-slate-500">Ganhos de hoje</div>
              <div className="mt-1 text-xl font-extrabold">
                {todayEarnings.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              <div className="mt-1 text-[10px] font-extrabold text-emerald-600">↑ 18% vs. ontem</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setTab("active");
                if (active[0]) setSelectedId(active[0].id);
              }}
              className="relative min-h-[148px] overflow-hidden rounded-2xl border border-slate-200/70 bg-white text-left shadow-sm"
            >
              <div className="absolute inset-0 bg-[#eef2f7]">
                <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(35deg, transparent 47%, #cbd5e1 48%, #cbd5e1 51%, transparent 52%), linear-gradient(125deg, transparent 47%, #dbe2ea 48%, #dbe2ea 51%, transparent 52%)", backgroundSize: "55px 55px" }} />
              </div>
              <svg viewBox="0 0 280 160" className="absolute inset-0 h-full w-full">
                <path d="M25 120 C75 35, 115 135, 165 88 S220 100, 260 45" fill="none" stroke="#3b82f6" strokeWidth="7" strokeLinecap="round" />
              </svg>
              <div className="absolute left-4 top-[88px] grid h-8 w-8 place-items-center overflow-hidden rounded-full border-2 border-white bg-orange-500 shadow">
                <img src="/bora-logo.svg" alt="" className="h-full w-full bg-white object-contain p-1" />
              </div>
              <div className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-red-500 text-white shadow">
                <House className="h-4 w-4" />
              </div>
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-[10px] font-extrabold text-slate-700 shadow">
                Abrir rota <ChevronRight className="h-3 w-3" />
              </span>
            </button>
          </div>

          {active[0] && (
            <button
              type="button"
              onClick={() => { setTab("active"); setSelectedId(active[0].id); }}
              className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-3 text-left"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500 text-white">
                <RouteIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue-500">Entrega atual</div>
                <div className="mt-1 truncate text-xs font-extrabold">#{active[0].id} • {active[0].customer}</div>
                <div className="mt-1 text-[10px] text-blue-700">{stageMeta[active[0].stage ?? "retirada"].next}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-blue-500" />
            </button>
          )}

          <div className="mt-5 grid grid-cols-3 rounded-2xl bg-slate-200/60 p-1">
            {[
              ["available", "Disponíveis", available.length],
              ["active", "Em andamento", active.length],
              ["history", "Histórico", history.length],
            ].map(([id, label, count]) => (
              <button
                key={String(id)}
                type="button"
                onClick={() => setTab(id as "available" | "active" | "history")}
                className={"rounded-xl px-2 py-3 text-[10px] font-extrabold transition " + (tab === id ? "bg-white text-orange-600 shadow-sm" : "text-slate-500")}
              >
                {String(label)} ({String(count)})
              </button>
            ))}
          </div>

          {tab === "available" && (
            <div className="mt-3 space-y-3">
              {available.map((delivery) => (
                <article key={delivery.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <button type="button" onClick={() => setSelectedId(delivery.id)} className="w-full text-left">
                    <div className="flex gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-orange-50">
                        <img src={delivery.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold">#{delivery.id}</span>
                          <span className="rounded-full bg-orange-50 px-2 py-1 text-[8px] font-extrabold text-orange-600">Novo</span>
                        </div>
                        <div className="mt-1 text-xs font-extrabold">{delivery.customer}</div>
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                          <MapPin className="h-3 w-3" />{delivery.neighborhood} • {delivery.distance}
                        </div>
                      </div>
                      <ChevronRight className="mt-1 h-4 w-4 text-slate-300" />
                    </div>
                  </button>

                  <div className="mt-3 flex items-center rounded-xl bg-slate-50 p-3">
                    <div>
                      <div className="text-sm font-extrabold">{delivery.fee}</div>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                        <WalletCards className="h-3 w-3" />{delivery.payment}
                      </div>
                    </div>
                    <div className="ml-5 flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Clock3 className="h-3 w-3" />~ {delivery.minutes} min
                    </div>
                    <button
                      type="button"
                      onClick={() => accept(delivery)}
                      className="ml-auto rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600"
                    >
                      Aceitar
                    </button>
                  </div>
                </article>
              ))}
              {available.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs font-semibold text-slate-400">
                  Nenhuma entrega disponível agora.
                </div>
              )}
            </div>
          )}

          {tab === "active" && (
            <div className="mt-3 space-y-3">
              {active.map((delivery) => {
                const stage = delivery.stage ?? "retirada";
                return (
                  <article key={delivery.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                    <button type="button" onClick={() => setSelectedId(delivery.id)} className="w-full text-left">
                      <div className="flex gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-blue-50">
                          <img src={delivery.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold">#{delivery.id}</span>
                            <span className="rounded-full bg-blue-50 px-2 py-1 text-[8px] font-extrabold text-blue-600">{stageMeta[stage].label}</span>
                          </div>
                          <div className="mt-1 text-xs font-extrabold">{delivery.customer}</div>
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                            <MapPin className="h-3 w-3" />{delivery.address}
                          </div>
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 text-slate-300" />
                      </div>
                    </button>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <a
                        href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(delivery.address)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-3 text-[11px] font-extrabold text-blue-600"
                      >
                        <Navigation className="h-4 w-4" /> Abrir rota
                      </a>
                      <button
                        type="button"
                        onClick={() => advance(delivery)}
                        className="rounded-xl bg-orange-500 px-3 py-3 text-[11px] font-extrabold text-white"
                      >
                        {stageMeta[stage].button}
                      </button>
                    </div>
                  </article>
                );
              })}
              {active.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs font-semibold text-slate-400">
                  Você não tem entregas em andamento.
                </div>
              )}
            </div>
          )}

          {tab === "history" && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
                  <div className="mt-3 text-[10px] font-semibold text-slate-500">Entregues hoje</div>
                  <div className="mt-1 text-xl font-extrabold">{history.length}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600"><CircleDollarSign className="h-4 w-4" /></div>
                  <div className="mt-3 text-[10px] font-semibold text-slate-500">Ganhos registrados</div>
                  <div className="mt-1 text-xl font-extrabold">{todayEarnings.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-orange-500" /><div className="text-xs font-extrabold">Resumo do turno</div></div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-slate-50 p-3"><div className="text-base font-extrabold">2,5 km</div><div className="mt-1 text-[9px] text-slate-400">média/rota</div></div>
                  <div className="rounded-xl bg-slate-50 p-3"><div className="text-base font-extrabold">14 min</div><div className="mt-1 text-[9px] text-slate-400">tempo médio</div></div>
                  <div className="rounded-xl bg-slate-50 p-3"><div className="text-base font-extrabold">4,9</div><div className="mt-1 text-[9px] text-slate-400">avaliação</div></div>
                </div>
              </div>

              {history.map((delivery) => (
                <button
                  key={delivery.id}
                  type="button"
                  onClick={() => setSelectedId(delivery.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-sm"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><Check className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold">#{delivery.id} • {delivery.customer}</div>
                    <div className="mt-1 truncate text-[10px] text-slate-400">{delivery.neighborhood} • entregue {delivery.deliveredAt}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold">{delivery.fee}</div>
                    <div className="mt-1 text-[9px] text-emerald-600">Concluída</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="sticky bottom-0 z-40 mt-2 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-xl">
          <div className="grid grid-cols-4">
            {[
              [House, "Início", () => window.scrollTo({ top: 0, behavior: "smooth" }), false],
              [Bike, "Entregas", () => setTab("active"), tab === "active" || tab === "available"],
              [BarChart3, "Ganhos", () => setTab("history"), tab === "history"],
              [UserRound, "Perfil", () => setProfileOpen(true), profileOpen],
            ].map(([Icon, label, onClick, activeItem]) => {
              const NavIcon = Icon as typeof Bike;
              return (
                <button
                  key={String(label)}
                  type="button"
                  onClick={onClick as () => void}
                  className={"flex flex-col items-center gap-1 rounded-xl py-2 text-[9px] font-extrabold " + (activeItem ? "bg-orange-50 text-orange-600" : "text-slate-500")}
                >
                  <NavIcon className="h-5 w-5" />{String(label)}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-t-[30px] bg-white p-5 shadow-2xl sm:rounded-[30px]">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-200 sm:hidden" />
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600"><Bike className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-orange-500">Entrega #{selected.id}</div>
                <div className="mt-1 text-lg font-extrabold">{selected.customer}</div>
                <div className="mt-1 text-[10px] text-slate-400">{selected.neighborhood} • {selected.distance}</div>
              </div>
              <button type="button" onClick={() => setSelectedId(null)} className="rounded-xl border border-slate-200 p-2 text-slate-500"><X className="h-4 w-4" /></button>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                <div><div className="text-xs font-extrabold">{selected.address}</div><div className="mt-1 text-[10px] text-slate-400">{selected.neighborhood}</div></div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={"tel:" + selected.phone.replace(/\D/g, "")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[10px] font-extrabold text-slate-700 shadow-sm"><Phone className="h-3.5 w-3.5" /> Ligar</a>
                <a href={"https://wa.me/55" + selected.phone.replace(/\D/g, "")} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-[10px] font-extrabold text-white"><MessageCircleMore className="h-3.5 w-3.5" /> WhatsApp</a>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-2"><PackageCheck className="h-4 w-4 text-orange-500" /><div className="text-xs font-extrabold">Pedido</div></div>
              <div className="mt-3 space-y-2">{selected.items.map((item) => <div key={item} className="rounded-xl bg-slate-50 px-3 py-2.5 text-[10px] font-semibold text-slate-600">{item}</div>)}</div>
              {selected.notes && <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2.5 text-[10px] font-semibold leading-5 text-amber-800">Obs.: {selected.notes}</div>}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-50 p-3 text-center"><WalletCards className="mx-auto h-4 w-4 text-slate-400" /><div className="mt-2 text-[9px] text-slate-400">Pagamento</div><div className="mt-1 text-[10px] font-extrabold">{selected.payment}</div></div>
              <div className="rounded-xl bg-slate-50 p-3 text-center"><Clock3 className="mx-auto h-4 w-4 text-slate-400" /><div className="mt-2 text-[9px] text-slate-400">Estimativa</div><div className="mt-1 text-[10px] font-extrabold">~ {selected.minutes} min</div></div>
              <div className="rounded-xl bg-slate-50 p-3 text-center"><CircleDollarSign className="mx-auto h-4 w-4 text-slate-400" /><div className="mt-2 text-[9px] text-slate-400">Ganho</div><div className="mt-1 text-[10px] font-extrabold">{selected.fee}</div></div>
            </div>

            {active.some((item) => item.id === selected.id) && (
              <>
                <div className="mt-5">
                  <div className="text-xs font-extrabold">Etapas da entrega</div>
                  <div className="mt-4 flex items-start">
                    {(["retirada", "a_caminho", "cheguei"] as DeliveryStage[]).map((stage, index) => {
                      const current = selected.stage ?? "retirada";
                      const currentIndex = ["retirada", "a_caminho", "cheguei"].indexOf(current);
                      const done = index <= currentIndex;
                      return (
                        <div key={stage} className="flex flex-1 items-start last:flex-none">
                          <div className="text-center">
                            <span className={"mx-auto grid h-8 w-8 place-items-center rounded-full text-[10px] font-extrabold " + (done ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400")}>{done ? "✓" : index + 1}</span>
                            <div className="mt-2 max-w-[82px] text-[9px] font-bold text-slate-500">{stageMeta[stage].label}</div>
                          </div>
                          {index < 2 && <div className={"mt-4 h-0.5 flex-1 " + (index < currentIndex ? "bg-orange-300" : "bg-slate-200")} />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <a href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(selected.address)} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs font-extrabold text-blue-600">
                  <Navigation className="h-4 w-4" /> Abrir rota no mapa
                </a>
                <button type="button" onClick={() => advance(selected)} className="mt-2 w-full rounded-xl bg-orange-500 px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-orange-500/20">
                  {stageMeta[selected.stage ?? "retirada"].button}
                </button>
              </>
            )}

            {available.some((item) => item.id === selected.id) && (
              <button type="button" onClick={() => accept(selected)} className="mt-5 w-full rounded-xl bg-orange-500 px-4 py-3 text-xs font-extrabold text-white">
                Aceitar esta entrega
              </button>
            )}

            {history.some((item) => item.id === selected.id) && (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-extrabold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> Entrega concluída
              </div>
            )}
          </div>
        </div>
      )}

      {profileOpen && (
        <div className="fixed inset-0 z-[85] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="w-full max-w-[430px] rounded-t-[30px] bg-white p-5 shadow-2xl sm:rounded-[30px]">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-200 sm:hidden" />
            <div className="flex items-start justify-between">
              <div><div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-orange-500">Meu perfil</div><h2 className="mt-1 text-xl font-extrabold">Lucas Mendes</h2></div>
              <button type="button" onClick={() => setProfileOpen(false)} className="rounded-xl border border-slate-200 p-2 text-slate-500"><X className="h-4 w-4" /></button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-slate-50 p-3 text-center"><div className="text-lg font-extrabold">{history.length}</div><div className="mt-1 text-[9px] text-slate-400">entregas hoje</div></div>
              <div className="rounded-2xl bg-slate-50 p-3 text-center"><div className="text-lg font-extrabold">4,9</div><div className="mt-1 text-[9px] text-slate-400">avaliação</div></div>
              <div className="rounded-2xl bg-slate-50 p-3 text-center"><div className="text-lg font-extrabold">96%</div><div className="mt-1 text-[9px] text-slate-400">conclusão</div></div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><Bike className="h-5 w-5" /></div><div><div className="text-xs font-extrabold">Honda CG 160</div><div className="mt-1 text-[10px] text-slate-400">Moto cadastrada • RJK-2A44</div></div></div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-100 p-4">
              <div className="text-xs font-extrabold">Turno de hoje</div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500"><span>Início</span><span className="font-extrabold text-slate-800">19:00</span></div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500"><span>Tempo online</span><span className="font-extrabold text-slate-800">3h 42min</span></div>
            </div>

            <button type="button" onClick={() => { setOnline((value) => !value); setProfileOpen(false); }} className={"mt-5 w-full rounded-xl px-4 py-3 text-xs font-extrabold " + (online ? "bg-slate-100 text-slate-700" : "bg-emerald-500 text-white")}>
              {online ? "Ficar offline" : "Ficar online"}
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div className="fixed bottom-20 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2.5 text-[10px] font-extrabold text-white shadow-2xl">
          {feedback}
        </div>
      )}
    </div>
  );
}
