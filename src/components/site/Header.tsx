import { useEffect, useState } from "react";
import { Menu, Monitor, Moon, Phone, ShoppingBag, Smartphone, Sun, X } from "lucide-react";
import { business } from "@/data/business";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import "../../theme.css";

const links = [
  { href: "#cardapio", label: "Cardápio" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

type ViewMode = "mobile" | "desktop";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("mobile");
  const [desktopOptionAvailable, setDesktopOptionAvailable] = useState(false);
  const { count, setOpen } = useCart();
  const mobileView = viewMode === "mobile";

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 24);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("bora-theme");
      const shouldUseDark = savedTheme ? savedTheme === "dark" : true;

      setDarkMode(shouldUseDark);
      document.documentElement.classList.toggle("dark", shouldUseDark);
    } catch {
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    const setMode = (mode: ViewMode) => {
      setViewMode(mode);
      document.documentElement.dataset["viewMode"] = mode;
      setMenuOpen(false);
    };

    const initializeViewMode = () => {
      const canUseDesktop = window.innerWidth >= 768;
      setDesktopOptionAvailable(canUseDesktop);

      if (!canUseDesktop) {
        setMode("mobile");
        return;
      }

      try {
        const savedMode = window.sessionStorage.getItem("bora-view-mode");
        setMode(savedMode === "desktop" ? "desktop" : "mobile");
      } catch {
        setMode("mobile");
      }
    };

    const handleResize = () => {
      const canUseDesktop = window.innerWidth >= 768;
      setDesktopOptionAvailable(canUseDesktop);
      if (!canUseDesktop) setMode("mobile");
    };

    initializeViewMode();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      delete document.documentElement.dataset["viewMode"];
    };
  }, []);

  const toggleViewMode = () => {
    const nextMode: ViewMode = mobileView ? "desktop" : "mobile";
    if (nextMode === "desktop" && window.innerWidth < 768) return;

    setViewMode(nextMode);
    setMenuOpen(false);
    document.documentElement.dataset["viewMode"] = nextMode;

    try {
      window.sessionStorage.setItem("bora-view-mode", nextMode);
    } catch {
      // A troca de visualização continua funcionando mesmo sem sessionStorage.
    }
  };

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current;
      document.documentElement.classList.toggle("dark", next);
      try {
        window.localStorage.setItem("bora-theme", next ? "dark" : "light");
      } catch {
        // O tema continua funcionando mesmo se o navegador bloquear o localStorage.
      }
      return next;
    });
  };

  return (
    <header
      data-site-header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/90 shadow-soft backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 md:py-4">
        <a href="#topo" className="flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-24 shrink-0 items-center justify-center md:h-14 md:w-28">
            <img
              src="/bora-logo.svg"
              alt={business.name}
              decoding="async"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="min-w-0">
            <span
              className={cn(
                "block truncate font-display text-base font-semibold leading-tight md:text-lg",
                scrolled ? "text-primary" : "text-primary-foreground",
              )}
            >
              {business.name}
            </span>
            <span
              className={cn(
                "hidden text-xs sm:block",
                scrolled ? "text-muted-foreground" : "text-primary-foreground/75",
              )}
            >
              {business.tagline}
            </span>
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className={cn("mr-2 items-center gap-1", mobileView ? "hidden" : "hidden md:flex")}>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium",
                  scrolled
                    ? "text-foreground/80 hover:bg-accent hover:text-primary"
                    : "text-primary-foreground/85 hover:bg-primary-foreground/15",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={darkMode ? "Modo escuro ativo. Ativar modo claro" : "Modo claro ativo. Ativar modo escuro"}
            aria-pressed={darkMode}
            title={darkMode ? "Modo escuro — toque para usar o modo claro" : "Modo claro — toque para usar o modo escuro"}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-bold shadow-sm transition-all duration-300 sm:px-3 sm:text-xs",
              darkMode
                ? "border-slate-500/70 bg-slate-800 text-slate-100"
                : "border-amber-200 bg-amber-50 text-amber-900",
            )}
          >
            {darkMode ? (
              <Moon className="h-4 w-4 text-sky-200" aria-hidden="true" />
            ) : (
              <Sun className="h-4 w-4 text-amber-600" aria-hidden="true" />
            )}
            <span>{darkMode ? "Escuro" : "Claro"}</span>
          </button>

          {desktopOptionAvailable && (
            <button
              type="button"
              onClick={toggleViewMode}
              aria-label={mobileView ? "Mudar para versão desktop" : "Mudar para versão mobile"}
              title={mobileView ? "Ver versão desktop" : "Voltar para versão mobile"}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-bold shadow-sm transition-all duration-300 sm:px-3 sm:text-xs",
                scrolled
                  ? "border-border bg-card text-foreground hover:bg-accent"
                  : "border-white/25 bg-white/10 text-primary-foreground backdrop-blur hover:bg-white/15",
              )}
            >
              {mobileView ? (
                <Monitor className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Smartphone className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{mobileView ? "Desktop" : "Mobile"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir carrinho"
            className={cn(
              "relative grid h-10 w-10 place-items-center rounded-full",
              scrolled
                ? "bg-accent text-primary"
                : "bg-primary-foreground/15 text-primary-foreground backdrop-blur",
            )}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-gold px-1 text-[11px] font-bold">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full",
              !mobileView && "md:hidden",
              scrolled
                ? "bg-accent text-primary"
                : "bg-primary-foreground/15 text-primary-foreground",
            )}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className={cn(
            "animate-rise mx-4 mb-3 rounded-3xl border border-border bg-card p-3 shadow-lift",
            !mobileView && "md:hidden",
          )}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground hover:bg-accent"
            >
              {link.label}
            </a>
          ))}
          <a
            href={business.phoneHref}
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium"
          >
            <Phone className="h-4 w-4" />
            {business.phone}
          </a>
        </div>
      )}
    </header>
  );
}
