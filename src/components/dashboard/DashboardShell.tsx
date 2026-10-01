
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Bike,
  Boxes,
  ChartNoAxesCombined,
  CircleDollarSign,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Package,
  Search,
  Settings,
  Tag,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";

type DashboardShellProps = {
  children: ReactNode;
  active: "dashboard" | "pedidos" | "motoboy";
  role: "Administrador" | "Atendente";
  name: string;
};

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  to?: "/painel/admin" | "/painel/pedidos" | "/painel/motoboy";
  badge?: string;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/painel/admin" },
  { id: "pedidos", label: "Pedidos", icon: ClipboardList, to: "/painel/pedidos", badge: "12" },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "categorias", label: "Categorias", icon: Boxes },
  { id: "promocoes", label: "Promoções", icon: Tag },
  { id: "motoboy", label: "Motoboys", icon: Bike, to: "/painel/motoboy" },
  { id: "atendentes", label: "Atendentes", icon: Users },
  { id: "financeiro", label: "Financeiro", icon: CircleDollarSign },
  { id: "relatorios", label: "Relatórios", icon: ChartNoAxesCombined },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

export function DashboardShell({ children, active, role, name }: DashboardShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const sidebar = (
    <aside className="flex h-full w-[250px] flex-col border-r border-slate-200/80 bg-white px-4 py-5">
      <Link to="/painel" className="mb-7 flex items-center gap-3 px-2">
        <img src="/bora-logo.svg" alt="Bora de Batata" className="h-10 w-10 rounded-xl object-contain" />
        <div className="leading-none">
          <div className="text-[17px] font-extrabold tracking-tight text-slate-950">Bora de Batata</div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">Gestão</div>
        </div>
      </Link>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          const base =
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition";
          const classes = isActive
            ? base + " bg-orange-50 text-orange-600"
            : base + " text-slate-600 hover:bg-slate-50 hover:text-slate-950";

          if (item.to) {
            return (
              <Link key={item.id} to={item.to} onClick={() => setMenuOpen(false)} className={classes}>
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          }

          return (
            <button key={item.id} type="button" className={classes}>
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              <span className="flex-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <div className="text-xs font-bold text-orange-600">Bora de Batata</div>
        <div className="mt-1 text-xs leading-5 text-slate-500">Painel operacional em construção.</div>
        <Link
          to="/"
          className="mt-3 inline-flex text-xs font-bold text-slate-800 underline decoration-orange-300 underline-offset-4"
        >
          Ver cardápio
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block">{sidebar}</div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative h-full w-[270px] shadow-2xl">
            {sidebar}
            <button
              type="button"
              aria-label="Fechar menu"
              className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              onClick={() => setMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pl-[250px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
          <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 xl:px-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden max-w-2xl flex-1 sm:block">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                aria-label="Buscar"
                placeholder="Buscar pedidos, clientes, produtos..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-50"
                aria-label="Notificações"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white">
                  3
                </span>
              </button>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-amber-300 text-xs font-extrabold text-white">
                  {name
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div className="hidden text-left sm:block">
                  <div className="text-xs font-bold text-slate-900">{name}</div>
                  <div className="text-[10px] text-slate-500">{role}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 xl:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PanelCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={"rounded-2xl border border-slate-200/70 bg-white shadow-[0_14px_40px_-30px_rgba(15,23,42,0.3)] " + className}>
      {children}
    </section>
  );
}
