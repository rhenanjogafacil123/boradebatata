import { createFileRoute } from "@tanstack/react-router";
import {
  CircleDollarSign,
  Eye,
  EyeOff,
  Package,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { DashboardShell, PanelCard } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/painel/produtos")({
  component: ProductsDashboard,
  head: () => ({
    meta: [
      { title: "Produtos | Bora de Batata" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type Product = {
  id: number;
  name: string;
  category: "Batatas" | "Pastéis" | "Bebidas";
  price: number;
  sales: number;
  active: boolean;
  description: string;
  image: string;
};

const initialProducts: Product[] = [
  { id: 1, name: "Carne moída com cheddar", category: "Batatas", price: 32.9, sales: 42, active: true, description: "Batata recheada com carne moída e cheddar.", image: "/bora-hero.png" },
  { id: 2, name: "Strogonoff de frango", category: "Batatas", price: 31.9, sales: 38, active: true, description: "Batata recheada com strogonoff de frango.", image: "/bora-hero.png" },
  { id: 3, name: "Bacon com cheddar", category: "Batatas", price: 29.9, sales: 34, active: true, description: "Batata recheada com bacon e cheddar.", image: "/bora-hero.png" },
  { id: 4, name: "Calabresa com cheddar", category: "Batatas", price: 29.9, sales: 31, active: true, description: "Batata recheada com calabresa e cheddar.", image: "/bora-hero.png" },
  { id: 5, name: "Carne moída com catupiry", category: "Batatas", price: 32.9, sales: 27, active: true, description: "Batata recheada com carne moída e catupiry.", image: "/bora-hero.png" },
  { id: 6, name: "Pastel montável", category: "Pastéis", price: 18.99, sales: 29, active: true, description: "Pastel montável com até sete ingredientes.", image: "/bora-hero.png" },
  { id: 7, name: "Pastel completo", category: "Pastéis", price: 24.99, sales: 25, active: false, description: "Pastel completo da casa.", image: "/bora-hero.png" },
  { id: 8, name: "Refrigerante lata", category: "Bebidas", price: 6.8, sales: 46, active: true, description: "Refrigerante em lata.", image: "/bora-drink.svg" },
  { id: 9, name: "Guaracamp", category: "Bebidas", price: 2.5, sales: 40, active: false, description: "Guaracamp gelado.", image: "/bora-drink.svg" },
];

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function ProductsDashboard() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"Todos" | Product["category"]>("Todos");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return products.filter((product) => {
      const matchesCategory = category === "Todos" || product.category === category;
      const matchesQuery =
        !normalized ||
        [product.name, product.category, product.description]
          .join(" ")
          .toLocaleLowerCase("pt-BR")
          .includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  const totalSales = products.reduce((sum, product) => sum + product.sales, 0);
  const activeCount = products.filter((product) => product.active).length;
  const pausedCount = products.length - activeCount;
  const estimatedRevenue = products.reduce((sum, product) => sum + product.sales * product.price, 0);

  function toggleProduct(id: number) {
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? { ...product, active: !product.active } : product,
      ),
    );
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") || "").trim(),
      category: String(data.get("category") || "Batatas") as Product["category"],
      price: Number(String(data.get("price") || "0").replace(",", ".")),
      description: String(data.get("description") || "").trim(),
    };

    if (!payload.name || !Number.isFinite(payload.price)) return;

    if (editing) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editing.id ? { ...product, ...payload } : product,
        ),
      );
      setEditing(null);
      return;
    }

    setProducts((current) => [
      {
        id: Date.now(),
        ...payload,
        sales: 0,
        active: true,
        image: payload.category === "Bebidas" ? "/bora-drink.svg" : "/bora-hero.png",
      },
      ...current,
    ]);
    setCreating(false);
  }

  const modalProduct = editing;

  return (
    <DashboardShell
      active="produtos"
      role="Administrador"
      name="Rafael Lima"
      search={{
        value: query,
        onChange: setQuery,
        placeholder: "Buscar produto, categoria ou descrição...",
      }}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-500">Catálogo</p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Dados demonstrativos</span>
          </div>
          <h1 className="mt-1 text-[34px] font-extrabold tracking-[-0.035em]">Produtos</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Edite preço e descrição, pause itens esgotados e cadastre novos produtos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" /> Novo produto
        </button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          [Package, "Produtos cadastrados", products.length, "Total no catálogo", "bg-orange-50 text-orange-600"],
          [Eye, "Disponíveis", activeCount, "Visíveis para venda", "bg-emerald-50 text-emerald-600"],
          [EyeOff, "Pausados", pausedCount, "Temporariamente indisponíveis", "bg-slate-100 text-slate-600"],
          [CircleDollarSign, "Receita dos itens", money.format(estimatedRevenue), totalSales + " vendas demonstrativas", "bg-violet-50 text-violet-600"],
        ].map(([Icon, label, value, note, tone]) => {
          const MetricIcon = Icon as typeof Package;
          return (
            <PanelCard key={String(label)} className="p-4">
              <div className="flex items-center gap-3">
                <div className={"grid h-11 w-11 place-items-center rounded-2xl " + String(tone)}>
                  <MetricIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-500">{String(label)}</div>
                  <div className="mt-0.5 truncate text-xl font-extrabold">{String(value)}</div>
                  <div className="mt-0.5 text-[10px] font-semibold text-slate-400">{String(note)}</div>
                </div>
              </div>
            </PanelCard>
          );
        })}
      </div>

      <PanelCard className="mt-4 overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="font-extrabold">Catálogo da loja</h2>
              <p className="mt-0.5 text-xs text-slate-400">{filtered.length} itens exibidos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(["Todos", "Batatas", "Pastéis", "Bebidas"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={
                  "rounded-xl px-3 py-2 text-[11px] font-extrabold transition " +
                  (category === item
                    ? "bg-orange-50 text-orange-600"
                    : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50")
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-xs">
            <thead className="bg-slate-50 text-slate-400">
              <tr>
                <th className="px-5 py-3">Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Vendas</th>
                <th>Status</th>
                <th className="pr-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" className="h-12 w-12 rounded-xl bg-orange-50 object-cover" />
                      <div>
                        <div className="font-extrabold text-slate-900">{product.name}</div>
                        <div className="mt-1 max-w-[340px] truncate text-[10px] text-slate-400">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-semibold text-slate-600">{product.category}</td>
                  <td className="font-extrabold text-slate-900">{money.format(product.price)}</td>
                  <td>
                    <div className="inline-flex items-center gap-1.5 font-bold text-slate-600">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> {product.sales}
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => toggleProduct(product.id)}
                      className={
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold " +
                        (product.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500")
                      }
                    >
                      <span className={"h-1.5 w-1.5 rounded-full " + (product.active ? "bg-emerald-500" : "bg-slate-400")} />
                      {product.active ? "Disponível" : "Pausado"}
                    </button>
                  </td>
                  <td className="pr-5 text-right">
                    <button
                      type="button"
                      onClick={() => setEditing(product)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-extrabold text-slate-600 hover:border-orange-200 hover:text-orange-600"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>

      {(creating || modalProduct) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-950/30 backdrop-blur-sm">
          <div className="h-full w-full max-w-[470px] overflow-y-auto bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-500">
                  {modalProduct ? "Editar produto" : "Novo produto"}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold">
                  {modalProduct ? modalProduct.name : "Cadastrar item"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setCreating(false);
                }}
                className="rounded-xl border border-slate-200 p-2 text-slate-500"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={saveProduct} className="mt-8 space-y-5">
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Nome</span>
                <input
                  name="name"
                  required
                  defaultValue={modalProduct?.name ?? ""}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Categoria</span>
                <select
                  name="category"
                  defaultValue={modalProduct?.category ?? "Batatas"}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                >
                  <option>Batatas</option>
                  <option>Pastéis</option>
                  <option>Bebidas</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Preço</span>
                <input
                  name="price"
                  inputMode="decimal"
                  required
                  defaultValue={modalProduct ? String(modalProduct.price).replace(".", ",") : ""}
                  placeholder="0,00"
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Descrição</span>
                <textarea
                  name="description"
                  rows={5}
                  defaultValue={modalProduct?.description ?? ""}
                  className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
              >
                {modalProduct ? "Salvar alterações" : "Adicionar produto"}
              </button>
              <p className="text-center text-[10px] leading-5 text-slate-400">
                Nesta etapa, as alterações ficam apenas na demonstração da tela. O banco será conectado depois.
              </p>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
