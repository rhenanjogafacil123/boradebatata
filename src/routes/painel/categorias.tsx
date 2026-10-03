import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Eye, EyeOff, Package, Pencil, Plus, ShoppingBag, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { DashboardShell, PanelCard } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/painel/categorias")({
  component: CategoriesDashboard,
  head: () => ({
    meta: [
      { title: "Categorias | Bora de Batata" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type Category = {
  id: number;
  name: string;
  description: string;
  products: number;
  active: boolean;
  order: number;
};

const seed: Category[] = [
  { id: 1, name: "Batatas recheadas", description: "Batatas de 300g e 500g com recheios variados.", products: 7, active: true, order: 1 },
  { id: 2, name: "Pastéis", description: "Pastel montável e opções completas.", products: 2, active: true, order: 2 },
  { id: 3, name: "Bebidas", description: "Refrigerantes, Guaracamp e outras bebidas.", products: 2, active: true, order: 3 },
  { id: 4, name: "Combos", description: "Combinações promocionais de comida e bebida.", products: 0, active: false, order: 4 },
];

function CategoriesDashboard() {
  const [categories, setCategories] = useState(seed);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return categories;
    return categories.filter((category) =>
      [category.name, category.description]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(normalized),
    );
  }, [categories, query]);

  const activeCount = categories.filter((category) => category.active).length;
  const productCount = categories.reduce((sum, category) => sum + category.products, 0);

  function toggle(id: number) {
    setCategories((current) =>
      current.map((category) =>
        category.id === id ? { ...category, active: !category.active } : category,
      ),
    );
  }

  function move(id: number, direction: -1 | 1) {
    setCategories((current) => {
      const ordered = [...current].sort((a, b) => a.order - b.order);
      const index = ordered.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= ordered.length) return current;
      const a = ordered[index];
      const b = ordered[target];
      if (!a || !b) return current;
      return current.map((item) => {
        if (item.id === a.id) return { ...item, order: b.order };
        if (item.id === b.id) return { ...item, order: a.order };
        return item;
      });
    });
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const description = String(data.get("description") || "").trim();
    if (!name) return;

    if (editing) {
      setCategories((current) =>
        current.map((category) =>
          category.id === editing.id ? { ...category, name, description } : category,
        ),
      );
      setEditing(null);
      return;
    }

    setCategories((current) => [
      ...current,
      {
        id: Date.now(),
        name,
        description,
        products: 0,
        active: true,
        order: Math.max(...current.map((category) => category.order), 0) + 1,
      },
    ]);
    setCreating(false);
  }

  return (
    <DashboardShell
      active="categorias"
      role="Administrador"
      name="Rafael Lima"
      search={{ value: query, onChange: setQuery, placeholder: "Buscar categoria..." }}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-500">Organização do cardápio</p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Dados demonstrativos</span>
          </div>
          <h1 className="mt-1 text-[34px] font-extrabold tracking-[-0.035em]">Categorias</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Organize o cardápio, defina a ordem de exibição e pause seções inteiras.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" /> Nova categoria
        </button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          { icon: Boxes, label: "Categorias", value: categories.length, note: "Total cadastrado", tone: "bg-orange-50 text-orange-600" },
          { icon: Eye, label: "Ativas", value: activeCount, note: "Visíveis no cardápio", tone: "bg-emerald-50 text-emerald-600" },
          { icon: EyeOff, label: "Pausadas", value: categories.length - activeCount, note: "Ocultas temporariamente", tone: "bg-slate-100 text-slate-600" },
          { icon: Package, label: "Produtos organizados", value: productCount, note: "Somando todas as categorias", tone: "bg-violet-50 text-violet-600" },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <PanelCard key={metric.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className={"grid h-11 w-11 place-items-center rounded-2xl " + metric.tone}>
                  <Icon className="h-5 w-5" />
                </div>
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

      <PanelCard className="mt-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="font-extrabold">Ordem do cardápio</h2>
              <p className="mt-1 text-xs text-slate-400">Use as setas para simular a ordem exibida aos clientes.</p>
            </div>
          </div>
        </div>
        <table className="w-full min-w-[880px] text-left text-xs">
          <thead className="bg-slate-50 text-slate-400">
            <tr>
              <th className="px-5 py-3">Ordem</th>
              <th>Categoria</th>
              <th>Produtos</th>
              <th>Status</th>
              <th>Reordenar</th>
              <th className="pr-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {[...filtered].sort((a, b) => a.order - b.order).map((category) => (
              <tr key={category.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-5 py-4">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-orange-50 font-extrabold text-orange-600">
                    {category.order}
                  </span>
                </td>
                <td>
                  <div className="font-extrabold text-slate-900">{category.name}</div>
                  <div className="mt-1 max-w-[380px] truncate text-[10px] text-slate-400">{category.description}</div>
                </td>
                <td className="font-extrabold">{category.products}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => toggle(category.id)}
                    className={
                      "rounded-full px-2.5 py-1 text-[10px] font-extrabold " +
                      (category.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")
                    }
                  >
                    {category.active ? "Ativa" : "Pausada"}
                  </button>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(category.id, -1)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 font-extrabold text-slate-500 hover:bg-slate-50">↑</button>
                    <button type="button" onClick={() => move(category.id, 1)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 font-extrabold text-slate-500 hover:bg-slate-50">↓</button>
                  </div>
                </td>
                <td className="pr-5 text-right">
                  <button
                    type="button"
                    onClick={() => setEditing(category)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-[11px] font-extrabold text-slate-600 hover:border-orange-200 hover:text-orange-600"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelCard>

      {(creating || editing) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-950/30 backdrop-blur-sm">
          <div className="h-full w-full max-w-[460px] bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-500">
                  {editing ? "Editar categoria" : "Nova categoria"}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold">{editing?.name ?? "Cadastrar seção"}</h2>
              </div>
              <button type="button" onClick={() => { setEditing(null); setCreating(false); }} className="rounded-xl border border-slate-200 p-2 text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={save} className="mt-8 space-y-5">
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Nome</span>
                <input name="name" required defaultValue={editing?.name ?? ""} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Descrição</span>
                <textarea name="description" rows={5} defaultValue={editing?.description ?? ""} className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
              </label>
              <button type="submit" className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-orange-600">
                {editing ? "Salvar alterações" : "Adicionar categoria"}
              </button>
              <p className="text-center text-[10px] leading-5 text-slate-400">Alterações demonstrativas até o banco ser conectado.</p>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
