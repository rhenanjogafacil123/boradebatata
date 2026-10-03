import { createFileRoute } from "@tanstack/react-router";
import { BadgePercent, CalendarClock, CircleDollarSign, Eye, EyeOff, Plus, Tag, TicketPercent, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { DashboardShell, PanelCard } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/painel/promocoes")({
  component: PromotionsDashboard,
  head: () => ({
    meta: [
      { title: "Promoções | Bora de Batata" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type Promotion = {
  id: number;
  title: string;
  type: "Percentual" | "Valor fixo" | "Combo";
  benefit: string;
  code: string;
  uses: number;
  limit: number | null;
  expires: string;
  active: boolean;
};

const seed: Promotion[] = [
  { id: 1, title: "Primeiro pedido", type: "Percentual", benefit: "10% OFF", code: "PRIMEIRA10", uses: 38, limit: 100, expires: "31/10/2026", active: true },
  { id: 2, title: "Combo da noite", type: "Combo", benefit: "Batata + bebida", code: "COMBODANOITE", uses: 24, limit: 80, expires: "15/10/2026", active: true },
  { id: 3, title: "Cupom R$ 5", type: "Valor fixo", benefit: "R$ 5 OFF", code: "BORA5", uses: 51, limit: 60, expires: "10/10/2026", active: true },
  { id: 4, title: "Volta pra Bora", type: "Percentual", benefit: "15% OFF", code: "VOLTEI15", uses: 17, limit: null, expires: "30/11/2026", active: false },
];

function PromotionsDashboard() {
  const [promotions, setPromotions] = useState(seed);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return promotions;
    return promotions.filter((promotion) =>
      [promotion.title, promotion.type, promotion.benefit, promotion.code]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(normalized),
    );
  }, [promotions, query]);

  const active = promotions.filter((promotion) => promotion.active).length;
  const totalUses = promotions.reduce((sum, promotion) => sum + promotion.uses, 0);

  function toggle(id: number) {
    setPromotions((current) =>
      current.map((promotion) =>
        promotion.id === id ? { ...promotion, active: !promotion.active } : promotion,
      ),
    );
  }

  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") || "").trim();
    const code = String(data.get("code") || "").trim().toUpperCase();
    const type = String(data.get("type") || "Percentual") as Promotion["type"];
    const benefit = String(data.get("benefit") || "").trim();
    const expires = String(data.get("expires") || "").trim();
    const limitRaw = String(data.get("limit") || "").trim();
    if (!title || !code || !benefit) return;

    setPromotions((current) => [
      {
        id: Date.now(),
        title,
        type,
        benefit,
        code,
        uses: 0,
        limit: limitRaw ? Number(limitRaw) : null,
        expires: expires || "Sem data",
        active: true,
      },
      ...current,
    ]);
    setCreating(false);
  }

  return (
    <DashboardShell
      active="promocoes"
      role="Administrador"
      name="Rafael Lima"
      search={{ value: query, onChange: setQuery, placeholder: "Buscar promoção ou cupom..." }}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-500">Campanhas e cupons</p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Dados demonstrativos</span>
          </div>
          <h1 className="mt-1 text-[34px] font-extrabold tracking-[-0.035em]">Promoções</h1>
          <p className="mt-1.5 text-sm text-slate-500">Crie cupons, combos e descontos com limite de uso e validade.</p>
        </div>
        <button type="button" onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600">
          <Plus className="h-4 w-4" /> Nova promoção
        </button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          { icon: Tag, label: "Campanhas", value: promotions.length, note: "Total criado", tone: "bg-orange-50 text-orange-600" },
          { icon: Eye, label: "Ativas", value: active, note: "Disponíveis agora", tone: "bg-emerald-50 text-emerald-600" },
          { icon: TicketPercent, label: "Usos de cupom", value: totalUses, note: "Somando campanhas", tone: "bg-violet-50 text-violet-600" },
          { icon: CircleDollarSign, label: "Desconto estimado", value: "R$ 486,20", note: "No período demonstrativo", tone: "bg-blue-50 text-blue-600" },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <PanelCard key={metric.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className={"grid h-11 w-11 place-items-center rounded-2xl " + metric.tone}><Icon className="h-5 w-5" /></div>
                <div><div className="text-xs font-semibold text-slate-500">{metric.label}</div><div className="mt-0.5 text-xl font-extrabold">{metric.value}</div><div className="mt-0.5 text-[10px] font-semibold text-slate-400">{metric.note}</div></div>
              </div>
            </PanelCard>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)] gap-4">
        <PanelCard className="overflow-hidden">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-extrabold">Campanhas cadastradas</h2>
            <p className="mt-1 text-xs text-slate-400">{filtered.length} promoções exibidas</p>
          </div>
          <table className="w-full min-w-[840px] text-left text-xs">
            <thead className="bg-slate-50 text-slate-400">
              <tr><th className="px-5 py-3">Campanha</th><th>Cupom</th><th>Benefício</th><th>Uso</th><th>Validade</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((promotion) => (
                <tr key={promotion.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-5 py-4"><div className="font-extrabold">{promotion.title}</div><div className="mt-1 text-[10px] text-slate-400">{promotion.type}</div></td>
                  <td><span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[10px] font-bold text-slate-700">{promotion.code}</span></td>
                  <td className="font-extrabold text-orange-600">{promotion.benefit}</td>
                  <td>
                    <div className="font-bold">{promotion.uses}{promotion.limit ? " / " + promotion.limit : ""}</div>
                    {promotion.limit && <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-orange-400" style={{ width: Math.min(100, (promotion.uses / promotion.limit) * 100) + "%" }} /></div>}
                  </td>
                  <td className="text-slate-500">{promotion.expires}</td>
                  <td>
                    <button type="button" onClick={() => toggle(promotion.id)} className={"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold " + (promotion.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                      {promotion.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {promotion.active ? "Ativa" : "Pausada"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PanelCard>

        <PanelCard className="p-5">
          <div className="flex items-center gap-2"><BadgePercent className="h-5 w-5 text-orange-500" /><h2 className="font-extrabold">Desempenho</h2></div>
          <div className="mt-5 space-y-4">
            {promotions.slice().sort((a, b) => b.uses - a.uses).map((promotion, index) => (
              <div key={promotion.id} className="rounded-2xl border border-slate-100 p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-orange-50 text-[10px] font-extrabold text-orange-600">{index + 1}</span>
                  <div className="min-w-0 flex-1"><div className="truncate text-xs font-extrabold">{promotion.title}</div><div className="mt-1 text-[10px] text-slate-400">{promotion.uses} utilizações</div></div>
                  <div className="text-xs font-extrabold">{promotion.benefit}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-extrabold"><CalendarClock className="h-4 w-4 text-orange-500" /> Próximo vencimento</div>
            <div className="mt-2 text-sm font-extrabold">BORA5 • 10/10/2026</div>
          </div>
        </PanelCard>
      </div>

      {creating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-950/30 backdrop-blur-sm">
          <div className="h-full w-full max-w-[470px] overflow-y-auto bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-500">Nova campanha</p><h2 className="mt-1 text-2xl font-extrabold">Criar promoção</h2></div>
              <button type="button" onClick={() => setCreating(false)} className="rounded-xl border border-slate-200 p-2 text-slate-500"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={create} className="mt-8 space-y-4">
              <label className="block"><span className="text-xs font-extrabold text-slate-700">Nome da campanha</span><input name="title" required className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" /></label>
              <label className="block"><span className="text-xs font-extrabold text-slate-700">Tipo</span><select name="type" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Percentual</option><option>Valor fixo</option><option>Combo</option></select></label>
              <label className="block"><span className="text-xs font-extrabold text-slate-700">Benefício</span><input name="benefit" required placeholder="Ex.: 10% OFF" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></label>
              <label className="block"><span className="text-xs font-extrabold text-slate-700">Código do cupom</span><input name="code" required placeholder="BORA10" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm uppercase" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="text-xs font-extrabold text-slate-700">Limite de usos</span><input name="limit" type="number" min="1" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></label>
                <label className="block"><span className="text-xs font-extrabold text-slate-700">Validade</span><input name="expires" placeholder="31/10/2026" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></label>
              </div>
              <button type="submit" className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-orange-600">Criar promoção</button>
              <p className="text-center text-[10px] leading-5 text-slate-400">Campanha simulada até a persistência ser conectada.</p>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
