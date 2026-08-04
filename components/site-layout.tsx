import type { ReactNode } from "react";
import { GlobalWhatsAppButton } from "@/components/global-whatsapp-button";
import { OrderCartProvider } from "@/components/order-cart-context";
import { RouteTransition } from "@/components/route-transition";
import { SiteFooter } from "@/components/site-footer";
import { Topbar } from "@/components/topbar";

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <OrderCartProvider>
      <div className="site-layout">
        <Topbar />
        <div className="site-layout__content">
          <RouteTransition>{children}</RouteTransition>
        </div>
        <SiteFooter />
        <GlobalWhatsAppButton />
      </div>
    </OrderCartProvider>
  );
}
