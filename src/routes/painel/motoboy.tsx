
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Bike,
  CheckCircle2,
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
  head: () => ({ meta: [{ title: "Minhas Entregas | Bora de Batata" }] }),
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
  emoji: string;
};

const seedAvailable: Delivery[] = [
  { id: 1048, store: "Bora de Batata", customer: "João Silva", address: "Rua das Flores, 123", distance: "2,1 km", fee: "R$ 8,50", payment: "Pix", minutes: 12, emoji: "🍔" },
  { id: 1049, store: "Bora de Batata", customer: "Mariana Costa", address: "Av. Brasil, 456", distance: "3,4 km", fee: "R$ 7,00", payment: "Cartão", minutes: 15, emoji: "🍟" },
  { id: 1050, store: "Bora de Batata", customer: "Carlos Ribeiro", address: "Rua Pioneiros, 789", distance: "2,8 km", fee: "R$ 6,00", payment: "Dinheiro", minutes: 10, emoji: "🥔" },
];

function MotoboyDashboard() {
  const [online, setOnline] = useState(true);
  const [available, setAvailable] = useState(seedAvailable);
  const [active, setActive] = useState<Delivery[]>([
    { id: 1045, store: "Bora de Batata", customer: "Ana Paula", address: "Rua das Acácias, 321", distance: "1,2 km", fee: "R$ 6,50", payment: "Pix", minutes: 8, emoji: "🍔" },
  ]);

  function accept(delivery: Delivery) {
    setAvailable((items) => items.filter((item) => item.id !== delivery.id));
    setActive((items) => [...items, delivery]);
  }

  function finish(delivery: Delivery) {
    setActive((items) => items.filter((item) => item.id !== delivery.id));
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-24 text-slate-950">
      <div className="mx-auto max-w-[980px] px-4 py-5 sm:px-6">
        <div className="flex items-center">
          <Link to="/painel" className="flex items-center gap-2">
            <img src="/bora-logo.svg" alt="Bora de Batata" className="h-10 w-10 rounded-xl bg-white object-contain p-1 shadow-sm" />
            <span className="hidden text-sm font-extrabold sm:block">Bora de Batata</span>
          </Link>
          <button type="button" className="relative ml-auto rounded-xl p-2.5 text-slate-500" aria-label="Notificações">
            <Bell className="h-5 w-5" />
            <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white">3</span>
          </button>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <div className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-slate-800 to-slate-600 text-white">
            <UserRound className="h-6 w-6" />
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#f5f7fb] bg-emerald-500" />
          </div>
          <div>
            <div className="text-lg font-extrabold">Lucas Mendes</div>
            <div className="text-sm text-slate-400">Motoboy</div>
          </div>
          <button
            type="button"
            onClick={() => setOnline((value) => !value)}
            className={"ml-auto inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-extrabold transition " + (online ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500")}
          >
            <span className={"h-2.5 w-2.5 rounded-full " + (online ? "bg-emerald-500" : "bg-slate-400")} />
            {online ? "Online" : "Offline"}
          </button>
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Minhas Entregas</h1>
          <p className="mt-2 text-sm text-slate-500">Acompanhe seus pedidos e ganhos em tempo real.</p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [WalletCards, "Disponíveis", String(available.length), "Pedidos na sua área", "bg-orange-50 text-orange-600"],
            [Bike, "Em rota", String(active.length), "Em andamento", "bg-blue-50 text-blue-600"],
            [CheckCircle2, "Concluídas hoje", "12", "↑ 20% vs. ontem", "bg-emerald-50 text-emerald-600"],
            [BarChart3, "Ganhos de hoje", "R$ 192,00", "↑ 18% vs. ontem", "bg-violet-50 text-violet-600"],
          ].map(([Icon, label, value, note, tone]) => {
            const MetricIcon = Icon as typeof Bike;
            return (
              <div key={String(label)} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_14px_40px_-30px_rgba(15,23,42,.3)]">
                <div className={"grid h-10 w-10 place-items-center rounded-xl " + String(tone)}><MetricIcon className="h-5 w-5" /></div>
                <div className="mt-3 text-xs font-semibold text-slate-500">{String(label)}</div>
                <div className="mt-1 text-xl font-extrabold">{String(value)}</div>
                <div className="mt-1 text-[10px] font-semibold text-slate-400">{String(note)}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-4 shadow-[0_14px_40px_-30px_rgba(15,23,42,.3)]">
          <div className="relative h-40 overflow-hidden rounded-2xl bg-[#eef2f7]">
            <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(35deg, transparent 47%, #cbd5e1 48%, #cbd5e1 51%, transparent 52%), linear-gradient(125deg, transparent 47%, #dbe2ea 48%, #dbe2ea 51%, transparent 52%)", backgroundSize: "70px 70px" }} />
            <svg viewBox="0 0 700 170" className="absolute inset-0 h-full w-full">
              <path d="M80 115 C160 35, 215 135, 310 85 S480 110, 600 50" fill="none" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
            </svg>
            <div className="absolute left-8 top-20 grid h-10 w-10 place-items-center rounded-full bg-orange-500 text-white shadow-lg">🍟</div>
            <div className="absolute right-16 top-6 grid h-10 w-10 place-items-center rounded-full bg-red-500 text-white shadow-lg"><House className="h-5 w-5" /></div>
            <button type="button" className="absolute bottom-3 right-3 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-slate-700 shadow-lg">
              Ver mapa completo
            </button>
          </div>
        </div>

        <div className="mt-6 flex rounded-2xl bg-slate-200/60 p-1">
          <button type="button" className="flex-1 rounded-xl bg-white px-3 py-3 text-xs font-extrabold text-orange-600 shadow-sm">Pedidos disponíveis ({available.length})</button>
          <button type="button" className="flex-1 px-3 py-3 text-xs font-extrabold text-slate-500">Minhas entregas ({active.length})</button>
        </div>

        <div className="mt-3 space-y-3">
          {available.map((delivery) => (
            <article key={delivery.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-orange-50 text-3xl">{delivery.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><span className="text-sm font-extrabold">#{delivery.id}</span><span className="rounded-full bg-orange-50 px-2 py-1 text-[9px] font-extrabold text-orange-600">Novo</span></div>
                  <div className="mt-1 text-sm font-bold">{delivery.store}</div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500"><UserRound className="h-3.5 w-3.5" />{delivery.customer}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{delivery.address} · {delivery.distance}</div>
                </div>
                <div className="min-w-40 border-t border-slate-100 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                  <div className="text-lg font-extrabold">{delivery.fee}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500"><WalletCards className="h-3.5 w-3.5" />{delivery.payment}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" />~ {delivery.minutes} min</div>
                </div>
                <button type="button" onClick={() => accept(delivery)} className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600">
                  Aceitar
                </button>
              </div>
            </article>
          ))}
          {available.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-400">Nenhuma entrega disponível agora.</div>
          )}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Minhas Entregas ({active.length})</h2>
          <button type="button" className="text-xs font-extrabold text-orange-600">Ver todas</button>
        </div>

        <div className="mt-3 space-y-3">
          {active.map((delivery) => (
            <article key={delivery.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-2xl">{delivery.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><span className="text-sm font-extrabold">#{delivery.id}</span><span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-extrabold text-blue-600">Em rota</span></div>
                  <div className="mt-1 text-xs font-bold">{delivery.customer}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{delivery.address} · {delivery.distance}</div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs font-extrabold text-blue-600"><Navigation className="h-4 w-4" />Abrir rota</button>
                  <button type="button" onClick={() => finish(delivery)} className="rounded-xl bg-emerald-500 px-4 py-3 text-xs font-extrabold text-white">Entregue</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[760px] grid-cols-4 px-2 py-2">
          {[
            [House, "Início", false],
            [Bike, "Entregas", true],
            [BarChart3, "Ganhos", false],
            [UserRound, "Perfil", false],
          ].map(([Icon, label, activeItem]) => {
            const NavIcon = Icon as typeof Bike;
            return (
              <button key={String(label)} type="button" className={"flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold " + (activeItem ? "bg-orange-50 text-orange-600" : "text-slate-500")}>
                <NavIcon className="h-5 w-5" />{String(label)}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
