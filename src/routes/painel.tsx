import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { panelAuthEnabled } from "@/lib/panel-auth";

export const Route = createFileRoute("/painel")({
  component: PainelLayout,
});

function PainelLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(panelAuthEnabled);

  const loginRoute = location.pathname === "/painel/login";

  useEffect(() => {
    if (!panelAuthEnabled || loginRoute) {
      setChecking(false);
      return;
    }

    let mounted = true;

    async function verify() {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return;

      if (error || !data.user) {
        setChecking(false);
        await navigate({ to: "/painel/login", replace: true });
        return;
      }

      setChecking(false);
    }

    void verify();

    return () => {
      mounted = false;
    };
  }, [loginRoute, navigate]);

  if (loginRoute) return <Outlet />;

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f5f7fb]">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-7 w-7 animate-spin text-orange-500" />
          <div className="mt-3 text-xs font-bold text-slate-500">Verificando acesso...</div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
