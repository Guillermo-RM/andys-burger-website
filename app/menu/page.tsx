import type { Metadata } from "next";
import { MenuPageOrdering } from "@/components/menu-page-ordering";
import { createImageStructuredData } from "@/lib/images";
import { burgers, extraCategories, potatoOrders } from "@/lib/menu";
import { absoluteUrl, businessId, menuId } from "@/lib/site";

const pageTitle = "Menú de hamburguesas en San Ramón";
const pageDescription =
  "Conocé las 13 hamburguesas de Andy's Burger en San Ramón, sus ingredientes, precios, extras y órdenes de papas para pedir por WhatsApp.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/menu",
  },
  keywords: [
    "menú de hamburguesas San Ramón",
    "hamburguesas San Ramón",
    "hamburguesas al grill San Ramón",
    "precios de hamburguesas San Ramón",
    "hamburguesas para llevar San Ramón",
    "hamburguesas a domicilio San Ramón",
    "extras para hamburguesas San Ramón",
    "papas gajo San Ramón",
    "papas crispy San Ramón",
    "Andy's Burger menú",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${pageTitle} | Andy's Burger`,
    description: pageDescription,
    type: "website",
    locale: "es_CR",
    images: [
      {
        url: burgers[0].image.social.src,
        width: burgers[0].image.social.width,
        height: burgers[0].image.social.height,
        alt: burgers[0].image.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | Andy's Burger`,
    description: pageDescription,
    images: [burgers[0].image.social.src],
  },
  other: {
    "geo.region": "CR-A",
    "geo.placename": "San Ramón, Alajuela",
    "geo.position": "10.1056999;-84.4650583",
    ICBM: "10.1056999, -84.4650583",
  },
};

const menuStructuredData = {
  "@context": "https://schema.org",
  "@type": "Menu",
  "@id": menuId,
  url: absoluteUrl("/menu"),
  provider: { "@id": businessId },
  name: "Menú de hamburguesas de Andy's Burger",
  description: pageDescription,
  inLanguage: "es-CR",
  hasMenuSection: [
    {
      "@type": "MenuSection",
      name: "Hamburguesas en San Ramón",
      hasMenuItem: burgers.map((burger) => ({
        "@type": "MenuItem",
        name: burger.name,
        description: burger.description,
        image: createImageStructuredData(burger.image),
        offers: {
          "@type": "Offer",
          price: burger.price,
          priceCurrency: "CRC",
        },
      })),
    },
    {
      "@type": "MenuSection",
      name: "Extras para hamburguesas",
      hasMenuItem: extraCategories.flatMap((category) =>
        category.items.map((extra) => ({
          "@type": "MenuItem",
          name: extra.name,
          description: `Extra de ${extra.name} para hamburguesas de Andy's Burger.`,
          offers: {
            "@type": "Offer",
            price: extra.price,
            priceCurrency: "CRC",
          },
        })),
      ),
    },
    {
      "@type": "MenuSection",
      name: "Órdenes adicionales de papas",
      hasMenuItem: potatoOrders.map((potato) => ({
        "@type": "MenuItem",
        name: potato.name,
        description: potato.description,
        offers: {
          "@type": "Offer",
          price: potato.price,
          priceCurrency: "CRC",
        },
      })),
    },
  ],
};

export default function MenuPage() {
  return (
    <main className="menu-page" aria-labelledby="menu-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(menuStructuredData).replace(/</g, "\\u003c"),
        }}
      />

      <header className="menu-page__hero">
        <p>13 opciones preparadas al momento</p>
        <h1 id="menu-title">Menú de hamburguesas en San Ramón</h1>
        <span>
          Descubrí las hamburguesas al grill de Andy&apos;s Burger, sus precios
          e ingredientes, además de extras y órdenes de papas. Elegí tus
          favoritos y pedilos por WhatsApp para llevar o recibir a domicilio en
          San Ramón.
        </span>
      </header>

      <MenuPageOrdering />
    </main>
  );
}
