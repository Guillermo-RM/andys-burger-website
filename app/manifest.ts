import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Andy's Burger — Hamburguesas San Ramón",
    short_name: "Andy's Burger",
    description:
      "Hamburguesas al grill, extras y órdenes de papas en San Juan de San Ramón, Alajuela.",
    start_url: "/",
    display: "standalone",
    background_color: "#010101",
    theme_color: "#010101",
    lang: "es-CR",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
