import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/painel")({
  component: PainelLayout,
});

function PainelLayout() {
  return <Outlet />;
}
