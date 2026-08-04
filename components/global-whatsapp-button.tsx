"use client";

import { useMemo } from "react";
import { useOrderCart } from "@/components/order-cart-context";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { burgers, extras, potatoOrders } from "@/lib/menu";

const whatsappNumber = "50689742305";
const orderProducts = [
  ...burgers.map((burger) => ({ ...burger, orderGroup: "burgers" as const })),
  ...extras.map((extra) => ({ ...extra, orderGroup: "extras" as const })),
  ...potatoOrders.map((potato) => ({
    ...potato,
    orderGroup: "potatoes" as const,
  })),
];

export function GlobalWhatsAppButton() {
  const { cart } = useOrderCart();
  const cartItems = useMemo(
    () =>
      orderProducts
        .filter((product) => (cart[product.id] ?? 0) > 0)
        .map((product) => ({ ...product, quantity: cart[product.id] })),
    [cart],
  );

  const openWhatsApp = () => {
    const sections = [
      { title: "HAMBURGUESAS", group: "burgers" },
      { title: "EXTRAS", group: "extras" },
      { title: "ÓRDENES DE PAPAS", group: "potatoes" },
    ]
      .map(({ title, group }) => {
        const lines = cartItems
          .filter((product) => product.orderGroup === group)
          .map((product) => `- ${product.name}, Cantidad: ${product.quantity}`);

        return lines.length ? [`*${title}*`, ...lines].join("\n") : null;
      })
      .filter((section): section is string => section !== null);

    const message = cartItems.length
      ? [
          "Hola, Andy's Burger!",
          "",
          "Quiero realizar el siguiente pedido:",
          "",
          sections.join("\n\n"),
          "",
          "Por favor, confirmame la disponibilidad y el total final.",
        ].join("\n")
      : "Hola, Andy's Burger! Quiero realizar un pedido.";

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
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
