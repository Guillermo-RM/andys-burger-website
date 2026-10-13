export type WhatsAppContactType = "general_contact" | "order_intent";

export type WhatsAppAnalyticsItem = {
  item_id: string;
  item_name: string;
  quantity: number;
};

type WhatsAppClickEvent = {
  event: "whatsapp_click";
  button_id: string;
  button_location: string;
  contact_type: WhatsAppContactType;
  page_path: string;
  cart_value?: number;
  currency?: "CRC";
  items?: WhatsAppAnalyticsItem[];
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

type TrackWhatsAppClickOptions = {
  buttonId: string;
  buttonLocation: string;
  contactType: WhatsAppContactType;
  cartValue?: number;
  items?: WhatsAppAnalyticsItem[];
};

export function trackWhatsAppClick({
  buttonId,
  buttonLocation,
  contactType,
  cartValue,
  items,
}: TrackWhatsAppClickOptions) {
  if (typeof window === "undefined") return;

  const eventData: WhatsAppClickEvent = {
    event: "whatsapp_click",
    button_id: buttonId,
    button_location: buttonLocation,
    contact_type: contactType,
    page_path: window.location.pathname,
  };

  if (contactType === "order_intent") {
    if (typeof cartValue === "number") {
      eventData.cart_value = cartValue;
      eventData.currency = "CRC";
    }

    if (items?.length) eventData.items = items;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(eventData);
}
