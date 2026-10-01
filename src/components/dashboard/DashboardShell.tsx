
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Bike,
  Boxes,
  ChartNoAxesCombined,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  LayoutDashboard,
  Monitor,
  Package,
  Search,
  Settings,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { type ReactNode } from "react";

type DashboardSearch = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type DashboardShellProps = {
  children: ReactNode;
  active: "dashboard" | "pedidos" | "motoboy";
  role: "Administrador" | "Atendente";
  name: string;
  search?: DashboardSearch;
};

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  to?: "/painel/admin" | "/painel/pedidos" | "/painel/motoboy";
  badge?: string;
  muted?: boolean;
};

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Visão geral",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/painel/admin" },
      { id: "pedidos", label: "Pedidos", icon: ClipboardList, to: "/painel/pedidos", badge: "12" },
    ],
  },
  {
    label: "Operação",
    items: [
      { id: "produtos", label: "Produtos", icon: Package, muted: true },
      { id: "categorias", label: "Categorias", icon: Boxes, muted: true },
      { id: "promocoes", label: "Promoções", icon: Tag, muted: true },
      { id: "motoboy", label: "Motoboys", icon: Bike, to: "/painel/motoboy" },
      { id: "atendentes", label: "Atendentes", icon: Users, muted: true },
    ],
  },
  {
    label: "Gestão",
    items: [
      { id: "financeiro", label: "Financeiro", icon: CircleDollarSign, muted: true },
      { id: "relatorios", label: "Relatórios", icon: ChartNoAxesCombined, muted: true },
      { id: "configuracoes", label: "Configurações", icon: Settings, muted: true },
    ],
  },
];

function DesktopOnlyNotice() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f5f7fb] px-5 xl:hidden">
      <div className="max-w-sm rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-[0_24px_80px_-50px_rgba(15,23,42,.55)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 text-orange-600">
          <Monitor className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950">Painel feito para computador</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          A administração e a central de pedidos usam bastante informação ao mesmo tempo. Abra em uma tela desktop com pelo menos 1280px para manter tudo legível.
        </p>
        <Link
          to="/painel"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"
        >
          Voltar para os painéis <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export function DashboardShell({ children, active, role, name, search }: DashboardShellProps) {
  return (
    <>
      <DesktopOnlyNotice />

      <div className="hidden min-h-screen bg-[#f5f7fb] text-slate-950 xl:block">
        <aside className="fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-slate-200/80 bg-white px-4 py-5">
          <Link to="/painel" className="mb-7 flex items-center gap-3 px-2">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50">
              <img src="/bora-logo.svg" alt="Bora de Batata" className="h-9 w-9 object-contain" />
            </div>
            <div className="leading-none">
              <div className="text-[16px] font-extrabold tracking-tight text-slate-950">Bora de Batata</div>
              <div className="mt-1.5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-orange-500">Painel de gestão</div>
            </div>
          </Link>

          <div className="space-y-6 overflow-y-auto pr-1">
            {navGroups.map((group) => (
              <div key={group.label}>
                <div className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-300">
                  {group.label}
                </div>
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === active;
                    const base =
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition";

                    if (item.to) {
                      return (
                        <Link
                          key={item.id}
                          to={item.to}
                          className={
                            base +
                            (isActive
                              ? " bg-orange-50 text-orange-600"
                              : " text-slate-600 hover:bg-slate-50 hover:text-slate-950")
                          }
                        >
                          <Icon className="h-[17px] w-[17px]" strokeWidth={2} />
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled
                        className={base + " cursor-not-allowed text-slate-400"}
                        title="Em construção"
                      >
                        <Icon className="h-[17px] w-[17px]" strokeWidth={2} />
                        <span className="flex-1">{item.label}</span>
                        {item.muted && <span className="text-[9px] font-bold text-slate-300">breve</span>}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className="mt-auto rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-600">Estrutura nova</div>
            <div className="mt-2 text-xs leading-5 text-slate-500">
              Dashboard, pedidos e motoboy já estão separados por função.
            </div>
            <Link to="/" className="mt-3 inline-flex text-xs font-extrabold text-slate-800">
              Ver cardápio <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>

        <div className="pl-[248px]">
          <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/92 backdrop-blur-xl">
            <div className="flex h-[70px] items-center gap-4 px-6 xl:px-8">
              {search ? (
                <div className="relative max-w-[620px] flex-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    aria-label="Buscar no painel"
                    value={search.value}
                    onChange={(event) => search.onChange(event.target.value)}
                    placeholder={search.placeholder ?? "Buscar pedidos, clientes, produtos..."}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Operação interna • Bora de Batata
                </div>
              )}

              <div className="ml-auto flex items-center gap-3">
                <button
                  type="button"
                  className="relative rounded-xl border border-transparent p-2.5 text-slate-500 transition hover:border-slate-200 hover:bg-slate-50"
                  aria-label="Notificações"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white">
                    3
                  </span>
                </button>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-amber-300 text-xs font-extrabold text-white">
                    {name
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div className="min-w-[112px] text-left">
                    <div className="text-xs font-extrabold text-slate-900">{name}</div>
                    <div className="text-[10px] text-slate-400">{role}</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6 xl:p-8">{children}</main>
        </div>
      </div>
    </>
  );
}

export function PanelCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={
        "rounded-2xl border border-slate-200/75 bg-white shadow-[0_16px_44px_-32px_rgba(15,23,42,0.32)] " +
        className
      }
    >
      {children}
    </section>
  );
}
