import { createFileRoute } from "@tanstack/react-router";
import { BellRing, Bike, Check, Clock3, Save, Settings, ShieldCheck, Store, WalletCards } from "lucide-react";
import { useState, type FormEvent } from "react";
import { DashboardShell, PanelCard } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/painel/configuracoes")({
  component: SettingsDashboard,
  head: () => ({
    meta: [
      { title: "Configurações | Bora de Batata" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
      <div className="min-w-0 flex-1"><div className="text-xs font-extrabold">{label}</div><div className="mt-1 text-[10px] leading-5 text-slate-400">{description}</div></div>
      <button type="button" onClick={() => onChange(!checked)} aria-pressed={checked} className={"relative h-7 w-12 rounded-full transition " + (checked ? "bg-orange-500" : "bg-slate-200")}>
        <span className={"absolute top-1 h-5 w-5 rounded-full bg-white shadow transition " + (checked ? "left-6" : "left-1")} />
      </button>
    </div>
  );
}

function SettingsDashboard() {
  const [saved, setSaved] = useState(false);
  const [acceptOrders, setAcceptOrders] = useState(true);
  const [automaticWhatsapp, setAutomaticWhatsapp] = useState(true);
  const [sound, setSound] = useState(true);
  const [notifyDelay, setNotifyDelay] = useState(true);
  const [cash, setCash] = useState(true);
  const [pix, setPix] = useState(true);
  const [card, setCard] = useState(true);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  return (
    <DashboardShell active="configuracoes" role="Administrador" name="Rafael Lima">
      <form onSubmit={save}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2"><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-500">Preferências da operação</p><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Demonstração local</span></div>
            <h1 className="mt-1 text-[34px] font-extrabold tracking-[-0.035em]">Configurações</h1>
            <p className="mt-1.5 text-sm text-slate-500">Centralize dados da loja, funcionamento, pagamentos e alertas.</p>
          </div>
          <button type="submit" className={"inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold text-white shadow-lg transition " + (saved ? "bg-emerald-500 shadow-emerald-500/20" : "bg-orange-500 shadow-orange-500/20 hover:bg-orange-600")}>
            {saved ? <Check className="h-4 w-4"/> : <Save className="h-4 w-4"/>}
            {saved ? "Salvo" : "Salvar alterações"}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
          <PanelCard className="p-6">
            <div className="flex items-center gap-2"><Store className="h-5 w-5 text-orange-500"/><div><h2 className="font-extrabold">Dados da loja</h2><p className="mt-1 text-xs text-slate-400">Informações exibidas e usadas no pedido.</p></div></div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <label className="col-span-2 block"><span className="text-xs font-extrabold text-slate-700">Nome da loja</span><input name="storeName" defaultValue="Bora de Batata" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
              <label className="block"><span className="text-xs font-extrabold text-slate-700">WhatsApp</span><input name="whatsapp" defaultValue="(21) 99054-3204" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
              <label className="block"><span className="text-xs font-extrabold text-slate-700">Cidade / região</span><input name="city" placeholder="Definir região" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
              <label className="col-span-2 block"><span className="text-xs font-extrabold text-slate-700">Endereço de saída</span><input name="address" placeholder="Necessário para calcular entregas automaticamente" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
            </div>
          </PanelCard>

          <PanelCard className="p-6">
            <div className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-orange-500"/><div><h2 className="font-extrabold">Funcionamento</h2><p className="mt-1 text-xs text-slate-400">Regras básicas para receber pedidos.</p></div></div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <label className="block"><span className="text-xs font-extrabold text-slate-700">Abertura</span><input name="open" type="time" defaultValue="19:00" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
              <label className="block"><span className="text-xs font-extrabold text-slate-700">Fechamento</span><input name="close" type="time" defaultValue="00:30" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
            </div>
            <div className="mt-5 space-y-3">
              <Toggle checked={acceptOrders} onChange={setAcceptOrders} label="Receber novos pedidos" description="Desative para pausar temporariamente toda a operação."/>
              <Toggle checked={automaticWhatsapp} onChange={setAutomaticWhatsapp} label="Mensagem de WhatsApp automática" description="Mantém o resumo do pedido pronto para envio no checkout."/>
            </div>
          </PanelCard>

          <PanelCard className="p-6">
            <div className="flex items-center gap-2"><Bike className="h-5 w-5 text-orange-500"/><div><h2 className="font-extrabold">Entrega</h2><p className="mt-1 text-xs text-slate-400">Parâmetros para frete e raio de atendimento.</p></div></div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <label className="block"><span className="text-xs font-extrabold text-slate-700">Valor por faixa</span><input name="deliveryAmount" placeholder="Ex.: 4,00" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
              <label className="block"><span className="text-xs font-extrabold text-slate-700">A cada km</span><input name="deliveryKm" defaultValue="1,5" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
              <label className="block"><span className="text-xs font-extrabold text-slate-700">Frete mínimo</span><input name="minimumFee" placeholder="0,00" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
              <label className="block"><span className="text-xs font-extrabold text-slate-700">Raio máximo</span><input name="maximumDistance" placeholder="Ex.: 8 km" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
            </div>
          </PanelCard>

          <PanelCard className="p-6">
            <div className="flex items-center gap-2"><WalletCards className="h-5 w-5 text-orange-500"/><div><h2 className="font-extrabold">Pagamentos</h2><p className="mt-1 text-xs text-slate-400">Escolha quais meios aparecem no fechamento.</p></div></div>
            <div className="mt-6 space-y-3">
              <Toggle checked={pix} onChange={setPix} label="Pix" description="Aceitar pagamento via Pix."/>
              <Toggle checked={card} onChange={setCard} label="Cartão" description="Aceitar cartão na entrega."/>
              <Toggle checked={cash} onChange={setCash} label="Dinheiro" description="Permitir informar troco no pedido."/>
            </div>
          </PanelCard>

          <PanelCard className="p-6">
            <div className="flex items-center gap-2"><BellRing className="h-5 w-5 text-orange-500"/><div><h2 className="font-extrabold">Alertas</h2><p className="mt-1 text-xs text-slate-400">Avisos para não perder pedidos ou atrasos.</p></div></div>
            <div className="mt-6 space-y-3">
              <Toggle checked={sound} onChange={setSound} label="Som em novo pedido" description="Toca um alerta quando um pedido entra na central."/>
              <Toggle checked={notifyDelay} onChange={setNotifyDelay} label="Avisar pedido atrasado" description="Destaca pedidos que ficarem tempo demais sem avançar."/>
            </div>
          </PanelCard>

          <PanelCard className="p-6">
            <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-orange-500"/><div><h2 className="font-extrabold">Segurança e acesso</h2><p className="mt-1 text-xs text-slate-400">Base preparada para controle por função.</p></div></div>
            <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-5">
              <div className="flex items-center gap-2 text-sm font-extrabold text-orange-800"><Settings className="h-4 w-4"/> Próxima etapa técnica</div>
              <p className="mt-2 text-xs leading-6 text-orange-700">Conectar autenticação e persistência para que configurações, produtos, equipe e permissões sejam salvos de verdade e respeitem o usuário logado.</p>
            </div>
          </PanelCard>
        </div>
      </form>
    </DashboardShell>
  );
}
