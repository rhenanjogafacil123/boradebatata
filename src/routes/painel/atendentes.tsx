import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock3, Headphones, Mail, Plus, ShieldCheck, UserCheck, Users, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { DashboardShell, PanelCard } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/painel/atendentes")({
  component: StaffDashboard,
  head: () => ({
    meta: [
      { title: "Atendentes | Bora de Batata" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type Staff = {
  id: number;
  name: string;
  email: string;
  shift: string;
  active: boolean;
  online: boolean;
  orders: number;
  averageMinutes: number;
};

const seed: Staff[] = [
  { id: 1, name: "Camila Oliveira", email: "camila@boradebatata.local", shift: "19h às 00h", active: true, online: true, orders: 46, averageMinutes: 3 },
  { id: 2, name: "Ana Souza", email: "ana@boradebatata.local", shift: "19h às 23h", active: true, online: true, orders: 39, averageMinutes: 4 },
  { id: 3, name: "Julia Martins", email: "julia@boradebatata.local", shift: "20h às 01h", active: true, online: false, orders: 34, averageMinutes: 5 },
  { id: 4, name: "Marina Costa", email: "marina@boradebatata.local", shift: "Folguista", active: false, online: false, orders: 18, averageMinutes: 6 },
];

function StaffDashboard() {
  const [staff, setStaff] = useState(seed);
  const [query, setQuery] = useState("");
  const [inviting, setInviting] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return staff;
    return staff.filter((member) =>
      [member.name, member.email, member.shift]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(normalized),
    );
  }, [staff, query]);

  const activeCount = staff.filter((member) => member.active).length;
  const onlineCount = staff.filter((member) => member.online && member.active).length;
  const orders = staff.reduce((sum, member) => sum + member.orders, 0);
  const avg = Math.round(staff.reduce((sum, member) => sum + member.averageMinutes, 0) / staff.length);

  function toggleActive(id: number) {
    setStaff((current) =>
      current.map((member) =>
        member.id === id ? { ...member, active: !member.active, online: member.active ? false : member.online } : member,
      ),
    );
  }

  function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const shift = String(data.get("shift") || "").trim();
    if (!name || !email) return;
    setStaff((current) => [
      ...current,
      { id: Date.now(), name, email, shift: shift || "A definir", active: true, online: false, orders: 0, averageMinutes: 0 },
    ]);
    setInviting(false);
  }

  return (
    <DashboardShell
      active="atendentes"
      role="Administrador"
      name="Rafael Lima"
      search={{ value: query, onChange: setQuery, placeholder: "Buscar atendente..." }}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-500">Equipe de atendimento</p><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Dados demonstrativos</span></div>
          <h1 className="mt-1 text-[34px] font-extrabold tracking-[-0.035em]">Atendentes</h1>
          <p className="mt-1.5 text-sm text-slate-500">Gerencie acessos, turnos e acompanhe o ritmo de atendimento.</p>
        </div>
        <button type="button" onClick={() => setInviting(true)} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600">
          <Plus className="h-4 w-4" /> Adicionar atendente
        </button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Equipe", value: staff.length, note: "Contas cadastradas", tone: "bg-violet-50 text-violet-600" },
          { icon: UserCheck, label: "Ativos", value: activeCount, note: "Com acesso liberado", tone: "bg-emerald-50 text-emerald-600" },
          { icon: Headphones, label: "Online agora", value: onlineCount, note: "Atendendo pedidos", tone: "bg-orange-50 text-orange-600" },
          { icon: Clock3, label: "Tempo médio", value: avg + " min", note: orders + " pedidos demonstrativos", tone: "bg-blue-50 text-blue-600" },
        ].map((metric) => {
          const Icon=metric.icon;
          return <PanelCard key={metric.label} className="p-4"><div className="flex items-center gap-3"><div className={"grid h-11 w-11 place-items-center rounded-2xl "+metric.tone}><Icon className="h-5 w-5"/></div><div><div className="text-xs font-semibold text-slate-500">{metric.label}</div><div className="mt-0.5 text-xl font-extrabold">{metric.value}</div><div className="mt-0.5 text-[10px] font-semibold text-slate-400">{metric.note}</div></div></div></PanelCard>;
        })}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1.4fr)_minmax(320px,.6fr)] gap-4">
        <PanelCard className="overflow-hidden">
          <div className="border-b border-slate-100 p-5"><h2 className="font-extrabold">Equipe cadastrada</h2><p className="mt-1 text-xs text-slate-400">Acesso da central de pedidos e desempenho demonstrativo.</p></div>
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead className="bg-slate-50 text-slate-400"><tr><th className="px-5 py-3">Atendente</th><th>Turno</th><th>Pedidos</th><th>Tempo médio</th><th>Presença</th><th>Acesso</th></tr></thead>
            <tbody>
              {filtered.map((member) => (
                <tr key={member.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-amber-300 font-extrabold text-white">{member.name.split(" ").slice(0,2).map((part)=>part[0]).join("")}</div><div><div className="font-extrabold">{member.name}</div><div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><Mail className="h-3 w-3"/>{member.email}</div></div></div></td>
                  <td className="font-semibold text-slate-600">{member.shift}</td>
                  <td className="font-extrabold">{member.orders}</td>
                  <td className="font-extrabold">{member.averageMinutes ? member.averageMinutes + " min" : "—"}</td>
                  <td><span className={"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold "+(member.online&&member.active?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-500")}><span className={"h-1.5 w-1.5 rounded-full "+(member.online&&member.active?"bg-emerald-500":"bg-slate-400")}/>{member.online&&member.active?"Online":"Offline"}</span></td>
                  <td><button type="button" onClick={()=>toggleActive(member.id)} className={"rounded-full px-2.5 py-1 text-[10px] font-extrabold "+(member.active?"bg-blue-50 text-blue-700":"bg-rose-50 text-rose-700")}>{member.active?"Acesso liberado":"Acesso bloqueado"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </PanelCard>

        <div className="space-y-4">
          <PanelCard className="p-5">
            <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-orange-500"/><h2 className="font-extrabold">Permissões do atendente</h2></div>
            <div className="mt-5 space-y-3">
              {["Visualizar pedidos","Alterar status do pedido","Criar pedido manual","Atribuir motoboy","Marcar produto esgotado"].map((permission)=><div key={permission} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-600"><CheckCircle2 className="h-4 w-4 text-emerald-500"/>{permission}</div>)}
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-3 text-xs font-semibold text-rose-600"><X className="h-4 w-4"/>Sem acesso ao financeiro</div>
            </div>
          </PanelCard>
        </div>
      </div>

      {inviting&&<div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-950/30 backdrop-blur-sm"><div className="h-full w-full max-w-[460px] bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-500">Novo acesso</p><h2 className="mt-1 text-2xl font-extrabold">Adicionar atendente</h2></div><button type="button" onClick={()=>setInviting(false)} className="rounded-xl border border-slate-200 p-2 text-slate-500"><X className="h-4 w-4"/></button></div>
        <form onSubmit={invite} className="mt-8 space-y-5">
          <label className="block"><span className="text-xs font-extrabold text-slate-700">Nome</span><input name="name" required className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
          <label className="block"><span className="text-xs font-extrabold text-slate-700">E-mail</span><input name="email" type="email" required className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
          <label className="block"><span className="text-xs font-extrabold text-slate-700">Turno</span><input name="shift" placeholder="Ex.: 19h às 00h" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
          <button type="submit" className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-orange-600">Adicionar à equipe</button>
          <p className="text-center text-[10px] leading-5 text-slate-400">O envio real de convite e autenticação entra quando conectarmos o banco.</p>
        </form>
      </div></div>}
    </DashboardShell>
  );
}
