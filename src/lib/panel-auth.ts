export const panelAuthEnabled =
  import.meta.env["VITE_PANEL_AUTH_ENABLED"] === "true";

export type PanelRole = "admin" | "attendant" | "courier";

export function roleHome(role: PanelRole | null | undefined) {
  if (role === "courier") return "/painel/motoboy" as const;
  if (role === "attendant") return "/painel/pedidos" as const;
  return "/painel/admin" as const;
}
