import { lazy, Suspense, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CartProvider, useCart } from "@/hooks/useCart";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { MenuSection } from "@/components/site/MenuSection";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { MobileCartBar } from "@/components/site/MobileCartBar";
import "@/mobile-fixes.css";

const loadCartDrawer = () => import("@/components/site/CartDrawer");
const LazyCartDrawer = lazy(async () => {
  const module = await loadCartDrawer();
  return { default: module.CartDrawer };
});

const title = "Bora de Batata | Batatas recheadas e pastéis";
const description =
  "Batatas recheadas de 300g e 500g, pastel montável e bebidas. Peça Bora de Batata pelo WhatsApp.";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "restaurant" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function PageContent() {
  const { open, count } = useCart();
  useEffect(() => {
    if (count > 0) void loadCartDrawer();
  }, [count]);
  return (
    <>
      <Header />
      <main data-site-main>
        <Hero />
        <MenuSection />
        <About />
        <Contact />
      </main>
      <Footer />
      {open && (
        <Suspense fallback={null}>
          <LazyCartDrawer />
        </Suspense>
      )}
      <MobileCartBar />
    </>
  );
}

function Index() {
  return (
    <CartProvider>
      <PageContent />
    </CartProvider>
  );
}
