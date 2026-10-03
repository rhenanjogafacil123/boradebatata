import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LockKeyhole, LogIn, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { panelAuthEnabled } from "@/lib/panel-auth";

export const Route = createFileRoute("/painel/login")({
  component: PanelLogin,
  head: () => ({
    meta: [
      { title: "Entrar no painel | Bora de Batata" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function PanelLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!panelAuthEnabled) return;
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) {
        void navigate({ to: "/painel" });
      }
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!panelAuthEnabled) return;

    setBusy(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage("Não foi possível entrar. Confira e-mail e senha.");
      setBusy(false);
      return;
    }

    await navigate({ to: "/painel" });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#f5f7fb] px-4 py-10">
      <div className="w-full max-w-[440px]">
        <div className="mb-7 flex items-center justify-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm">
            <img src="/bora-logo.svg" alt="Bora de Batata" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-950">Bora de Batata</div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-500">Acesso interno</div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_28px_90px_-55px_rgba(15,23,42,.6)]">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950">Entrar no painel</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Use a conta da equipe para acessar somente as áreas liberadas para sua função.
          </p>

          {!panelAuthEnabled ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800">
                <ShieldCheck className="h-4 w-4" /> Autenticação preparada
              </div>
              <p className="mt-2 text-xs leading-5 text-amber-700">
                O código do login já está pronto, mas a proteção permanece desligada até o banco e as variáveis do Supabase serem aplicados.
              </p>
              <Link
                to="/painel"
                className="mt-4 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-extrabold text-white"
              >
                Continuar no modo atual
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-7 space-y-4">
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">E-mail</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Senha</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </label>

              {errorMessage && (
                <div className="rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" /> {busy ? "Entrando..." : "Entrar"}
              </button>
            </form>
          )}
        </div>

        <div className="mt-5 text-center text-[10px] leading-5 text-slate-400">
          A sessão é gerenciada pelo Supabase Auth. Não compartilhe credenciais entre funções.
        </div>
      </div>
    </div>
  );
}
