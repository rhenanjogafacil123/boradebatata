
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Bike,
  CheckCircle2,
  ChevronRight,
  Clock3,
  House,
  MapPin,
  Navigation,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/painel/motoboy")({
  component: MotoboyDashboard,
  head: () => ({ meta: [{ title: "Minhas Entregas | Bora de Batata" }, { name: "robots", content: "noindex,nofollow" }] }),
});

type Delivery = {
  id: number;
  store: string;
  customer: string;
  address: string;
  distance: string;
  fee: string;
  payment: string;
  minutes: number;
  image: string;
};

const seedAvailable: Delivery[] = [
  { id: 1048, store: "Bora de Batata", customer: "João Silva", address: "Rua das Flores, 123", distance: "2,1 km", fee: "R$ 8,50", payment: "Pix", minutes: 12, image: "/bora-hero.png" },
  { id: 1049, store: "Bora de Batata", customer: "Mariana Costa", address: "Av. Brasil, 456", distance: "3,4 km", fee: "R$ 7,00", payment: "Cartão", minutes: 15, image: "/bora-hero.png" },
  { id: 1050, store: "Bora de Batata", customer: "Carlos Ribeiro", address: "Rua Pioneiros, 789", distance: "2,8 km", fee: "R$ 6,00", payment: "Dinheiro", minutes: 10, image: "/bora-hero.png" },
];

function MotoboyDashboard() {
  const [online, setOnline] = useState(true);
  const [tab, setTab] = useState<"available" | "active">("available");
  const [available, setAvailable] = useState(seedAvailable);
  const [active, setActive] = useState<Delivery[]>([
    { id: 1045, store: "Bora de Batata", customer: "Ana Paula", address: "Rua das Acácias, 321", distance: "1,2 km", fee: "R$ 6,50", payment: "Pix", minutes: 8, emoji: "🍔" },
  ]);

  function accept(delivery: Delivery) {
    setAvailable((items) => items.filter((item) => item.id !== delivery.id));
    setActive((items) => [...items, delivery]);
    setTab("active");
  }

  function finish(delivery: Delivery) {
    setActive((items) => items.filter((item) => item.id !== delivery.id));
  }

  return (
    <div className="min-h-screen bg-[#edf0f5] py-0 text-slate-950 sm:py-6">
      <div className="mx-auto min-h-screen w-full max-w-[420px] overflow-hidden bg-[#f7f8fb] shadow-[0_24px_80px_-30px_rgba(15,23,42,.32)] sm:min-h-[calc(100vh-48px)] sm:rounded-[30px]">
        <div className="px-4 pb-4 pt-4">
          <div className="flex items-center">
            <Link to="/painel" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm">
                <img src="/bora-logo.svg" alt="Bora de Batata" className="h-8 w-8 object-contain" />
              </div>
              <span className="text-xs font-extrabold">Bora de Batata</span>
            </Link>
            <button type="button" className="relative ml-auto rounded-xl p-2.5 text-slate-500" aria-label="Notificações">
              <Bell className="h-5 w-5" />
              <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white">3</span>
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="relative grid h-13 w-13 place-items-center rounded-full bg-gradient-to-br from-slate-800 to-slate-600 text-white">
              <UserRound className="h-6 w-6" />
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#f7f8fb] bg-emerald-500" />
            </div>
            <div>
              <div className="text-base font-extrabold">Lucas Mendes</div>
              <div className="text-xs text-slate-400">Motoboy</div>
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
            <p className="mt-1 text-xs leading-5 text-slate-500">Pedidos, rotas e ganhos em um só lugar.</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              [WalletCards, "Disponíveis", String(available.length), "bg-orange-50 text-orange-600"],
              [Bike, "Em rota", String(active.length), "bg-blue-50 text-blue-600"],
              [CheckCircle2, "Concluídas", "12", "bg-emerald-50 text-emerald-600"],
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
            <div id="ganhos-motoboy" className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="mt-3 text-[10px] font-semibold text-slate-500">Ganhos de hoje</div>
              <div className="mt-1 text-xl font-extrabold">R$ 192,00</div>
              <div className="mt-1 text-[10px] font-extrabold text-emerald-600">↑ 18% vs. ontem</div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
              <div className="absolute inset-0 bg-[#eef2f7]">
                <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(35deg, transparent 47%, #cbd5e1 48%, #cbd5e1 51%, transparent 52%), linear-gradient(125deg, transparent 47%, #dbe2ea 48%, #dbe2ea 51%, transparent 52%)", backgroundSize: "55px 55px" }} />
              </div>
              <svg viewBox="0 0 280 160" className="absolute inset-0 h-full w-full">
                <path d="M25 120 C75 35, 115 135, 165 88 S220 100, 260 45" fill="none" stroke="#3b82f6" strokeWidth="7" strokeLinecap="round" />
              </svg>
              <div className="absolute left-4 top-22 grid h-8 w-8 place-items-center overflow-hidden rounded-full border-2 border-white bg-orange-500 shadow"><img src="/bora-logo.svg" alt="" className="h-full w-full bg-white object-contain p-1" /></div>
              <div className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-red-500 text-white shadow">
                <House className="h-4 w-4" />
              </div>
              <button type="button" onClick={() => setTab("active")} className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-[10px] font-extrabold text-slate-700 shadow">
                Minhas rotas <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 rounded-2xl bg-slate-200/60 p-1">
            <button
              type="button"
              onClick={() => setTab("available")}
              className={"rounded-xl px-3 py-3 text-[11px] font-extrabold transition " + (tab === "available" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500")}
            >
              Disponíveis ({available.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("active")}
              className={"rounded-xl px-3 py-3 text-[11px] font-extrabold transition " + (tab === "active" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500")}
            >
              Minhas entregas ({active.length})
            </button>
          </div>

          {tab === "available" ? (
            <div className="mt-3 space-y-3">
              {available.map((delivery) => (
                <article key={delivery.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <div className="flex gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-orange-50"><img src={delivery.image} alt="" className="h-full w-full object-cover" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold">#{delivery.id}</span>
                        <span className="rounded-full bg-orange-50 px-2 py-1 text-[8px] font-extrabold text-orange-600">Novo</span>
                      </div>
                      <div className="mt-1 text-xs font-extrabold">{delivery.store}</div>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500"><UserRound className="h-3 w-3" />{delivery.customer}</div>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500"><MapPin className="h-3 w-3" />{delivery.address}</div>
                      <div className="mt-1 text-[9px] font-semibold text-slate-400">{delivery.distance}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center rounded-xl bg-slate-50 p-3">
                    <div>
                      <div className="text-sm font-extrabold">{delivery.fee}</div>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500"><WalletCards className="h-3 w-3" />{delivery.payment}</div>
                    </div>
                    <div className="ml-5">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500"><Clock3 className="h-3 w-3" />~ {delivery.minutes} min</div>
                    </div>
                    <button type="button" onClick={() => accept(delivery)} className="ml-auto rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600">
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
          ) : (
            <div className="mt-3 space-y-3">
              {active.map((delivery) => (
                <article key={delivery.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <div className="flex gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-blue-50"><img src={delivery.image} alt="" className="h-full w-full object-cover" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold">#{delivery.id}</span>
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-[8px] font-extrabold text-blue-600">Em rota</span>
                      </div>
                      <div className="mt-1 text-xs font-extrabold">{delivery.customer}</div>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500"><MapPin className="h-3 w-3" />{delivery.address}</div>
                      <div className="mt-1 text-[9px] font-semibold text-slate-400">{delivery.distance}</div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(delivery.address)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-3 text-[11px] font-extrabold text-blue-600">
                      <Navigation className="h-4 w-4" /> Abrir rota
                    </a>
                    <button type="button" onClick={() => finish(delivery)} className="rounded-xl bg-emerald-500 px-3 py-3 text-[11px] font-extrabold text-white">
                      Marcar entregue
                    </button>
                  </div>
                </article>
              ))}
              {active.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs font-semibold text-slate-400">
                  Você não tem entregas em andamento.
                </div>
              )}
            </div>
          )}
        </div>

        <nav className="sticky bottom-0 z-40 mt-2 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-xl">
          <div className="grid grid-cols-4">
            {[
              [House, "Início", () => window.scrollTo({ top: 0, behavior: "smooth" }), false],
              [Bike, "Entregas", () => setTab("available"), true],
              [BarChart3, "Ganhos", () => document.getElementById("ganhos-motoboy")?.scrollIntoView({ behavior: "smooth", block: "center" }), false],
              [UserRound, "Perfil", () => window.scrollTo({ top: 0, behavior: "smooth" }), false],
            ].map(([Icon, label, onClick, activeItem]) => {
              const NavIcon = Icon as typeof Bike;
              return (
                <button key={String(label)} type="button" onClick={onClick as () => void} className={"flex flex-col items-center gap-1 rounded-xl py-2 text-[9px] font-extrabold " + (activeItem ? "bg-orange-50 text-orange-600" : "text-slate-500")}>
                  <NavIcon className="h-5 w-5" />{String(label)}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
