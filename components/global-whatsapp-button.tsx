"use client";

import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { whatsappGreetingUrl } from "@/lib/whatsapp";

export function GlobalWhatsAppButton() {
  const openWhatsApp = () => {
    window.open(
      whatsappGreetingUrl,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <button
      className="mobile-order-actions__whatsapp global-whatsapp-button"
      type="button"
      aria-label="Contactar a Andy's Burger por WhatsApp"
      title="Contactar por WhatsApp"
      onClick={openWhatsApp}
    >
      <WhatsAppIcon />
    </button>
  );
}
