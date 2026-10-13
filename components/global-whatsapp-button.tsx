"use client";

import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { trackWhatsAppClick } from "@/lib/analytics";
import { whatsappGreetingUrl } from "@/lib/whatsapp";

export function GlobalWhatsAppButton() {
  const openWhatsApp = () => {
    trackWhatsAppClick({
      buttonId: "whatsapp-floating",
      buttonLocation: "floating",
      contactType: "general_contact",
    });
    window.open(
      whatsappGreetingUrl,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <button
      id="whatsapp-floating"
      className="mobile-order-actions__whatsapp global-whatsapp-button"
      type="button"
      data-analytics="whatsapp"
      data-location="floating"
      data-action="general_contact"
      aria-label="Contactar a Andy's Burger por WhatsApp"
      title="Contactar por WhatsApp"
      onClick={openWhatsApp}
    >
      <WhatsAppIcon />
    </button>
  );
}
