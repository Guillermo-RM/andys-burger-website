import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GoogleReviewsCarousel } from "@/components/google-reviews-carousel";
import { HomeBurgerMenu } from "@/components/home-burger-menu";
import { createImageStructuredData, siteImages } from "@/lib/images";
import { burgers, extras, potatoOrders } from "@/lib/menu";
import { absoluteUrl, businessId, menuId, websiteId } from "@/lib/site";

const heroImage = siteImages.homeHero;
const seoTitle = "Hamburguesas San Ramón";
const seoDescription =
  "Conocé el menú de Andy's Burger en San Ramón, Alajuela: 13 hamburguesas al grill, extras, órdenes de papas y pedido directo por WhatsApp.";

export const metadata: Metadata = {
  title: {
    absolute: seoTitle,
  },
  description: seoDescription,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "hamburguesas San Ramón",
    "hamburguesas en San Ramón",
    "hamburguesas San Ramón Alajuela",
    "hamburguesas al grill San Ramón",
    "hamburguesas con papas San Ramón",
    "precios de hamburguesas San Ramón",
    "restaurante de hamburguesas San Ramón",
    "Andy's Burger San Ramón",
    "menú de hamburguesas San Ramón",
    "menú Andy's Burger",
    "hamburguesas para pedir San Ramón",
    "extras para hamburguesas San Ramón",
    "orden de papas San Ramón",
    "papas gajo San Ramón",
    "papas crispy San Ramón",
  ],
  category: "Restaurante de hamburguesas",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    type: "website",
    locale: "es_CR",
    siteName: "Andy's Burger",
    images: [
      {
        url: heroImage.social.src,
        width: heroImage.social.width,
        height: heroImage.social.height,
        alt: heroImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: [heroImage.social.src],
  },
};

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": absoluteUrl("/#pagina-inicio"),
      url: absoluteUrl("/"),
      name: seoTitle,
      description: seoDescription,
      inLanguage: "es-CR",
      primaryImageOfPage: createImageStructuredData(heroImage, {
        representativeOfPage: true,
      }),
      isPartOf: { "@id": websiteId },
      about: { "@id": businessId },
      mainEntity: { "@id": menuId },
    },
    {
      "@type": "Menu",
      "@id": menuId,
      url: absoluteUrl("/menu"),
      provider: { "@id": businessId },
      name: "Menú de hamburguesas en San Ramón de Andy's Burger",
      description:
        "Menú con 13 hamburguesas al grill, extras y órdenes adicionales de papas de Andy's Burger en San Ramón, Alajuela.",
      inLanguage: "es-CR",
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: "Hamburguesas San Ramón",
          description:
            "Hamburguesas al grill con opción de papas gajo o crispy en San Ramón, Alajuela.",
          hasMenuItem: burgers.map((burger) => ({
            "@type": "MenuItem",
            name: burger.name,
            description: `${burger.description} ${burger.ingredients} Incluye papas gajo o crispy.`,
            image: {
              ...createImageStructuredData(burger.image),
              keywords: [
                burger.name,
                "hamburguesas San Ramón",
                "Andy's Burger San Ramón",
              ],
            },
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
          description:
            "Ingredientes adicionales para personalizar hamburguesas de Andy's Burger en San Ramón.",
          hasMenuItem: extras.map((extra) => ({
            "@type": "MenuItem",
            name: extra.name,
            description: `${extra.name}, extra de la categoría ${extra.category}.`,
            offers: {
              "@type": "Offer",
              price: extra.price,
              priceCurrency: "CRC",
            },
          })),
        },
        {
          "@type": "MenuSection",
          name: "Órdenes adicionales de papas",
          description:
            "Órdenes extra de papas gajo y papas crispy de Andy's Burger en San Ramón.",
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
    },
  ],
};

export default function Home() {
  return (
    <main className="route-shell" aria-labelledby="home-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <section className="hero">
        <Image
          className="hero__image"
          src={heroImage.src}
          width={heroImage.width}
          height={heroImage.height}
          sizes="100vw"
          alt={heroImage.alt}
          preload
        />
        <div className="hero__content">
          <div className="hero__headline-band">
            <p className="hero__headline">
              Hamburguesas al grill en San Ramón, preparadas al momento
            </p>
            <div className="hero__actions" aria-label="Acciones principales">
              <Link className="hero__button hero__button--primary" href="/menu">
                <span className="hero__button-text">Andy&apos;s</span>
                <span className="hero__button-accent">Menú</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="home-intro" aria-labelledby="home-title">
        <p className="home-intro__brand">Andy&apos;s Burger</p>
        <h1 id="home-title">Hamburguesas San Ramón</h1>
        <p>
          Disfrutá hamburguesas al grill en Andy&apos;s Burger, San Ramón,
          Alajuela. Conocé nuestro menú, ubicación y opciones para pedir.
        </p>
      </section>
      <HomeBurgerMenu />
      <section className="why-andys" aria-labelledby="why-andys-title">
        <div className="why-andys__heading">
          <p>Sabor local en cada pedido</p>
          <h2 id="why-andys-title">
            ¿Por qué elegir Andy&apos;s Burger en San Ramón?
          </h2>
          <span>
            Nuestro menú de hamburguesas en San Ramón reúne opciones al grill,
            acompañamientos y extras para preparar tu pedido como más te gusta,
            con porciones pensadas para que disfrutés y quedés satisfecho en
            cada compra.
          </span>
        </div>

        <div className="why-andys__grid">
          <article className="why-andys__card">
            <span aria-hidden="true">01</span>
            <h3>Hamburguesas al grill preparadas al momento</h3>
            <p>
              Cada pedido se prepara cuando lo elegís para que disfrutés el
              sabor de Andy&apos;s Burger recién hecho.
            </p>
          </article>

          <article className="why-andys__card">
            <span aria-hidden="true">02</span>
            <h3>Un menú con 13 hamburguesas</h3>
            <p>
              Encontrá hamburguesa doble, opciones con bacon, guacamole,
              cheddar, pollo empanizado y sabores picantes.
            </p>
          </article>

          <article className="why-andys__card">
            <span aria-hidden="true">03</span>
            <h3>Tu pedido, a tu gusto</h3>
            <p>
              Escogé papas gajo o crispy, agregá tus extras favoritos y pedí
              hamburguesas por WhatsApp de forma sencilla.
            </p>
          </article>
        </div>
      </section>
      <GoogleReviewsCarousel />
    </main>
  );
}
