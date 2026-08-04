import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { siteImages } from "@/lib/images";

const businessPhone = "+506 8651 0588";
const businessPhoneHref = "tel:+50686510588";
const whatsappUrl =
  "https://wa.me/50689742305?text=Hola%2C%20Andy%27s%20Burger!%20Quiero%20realizar%20un%20pedido.";
const googleMapsUrl =
  "https://www.google.com/maps/place/Andy's+Burger/data=!4m2!3m1!1s0x0:0xcace868bb64699d6";
const googleMapsEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3927.9191987430827!2d-84.4650583!3d10.1056999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0450051232683%3A0xcace868bb64699d6!2sAndy's%20Burger!5e0!3m2!1ses!2scr!4v1785863337534!5m2!1ses!2scr";
const contactTitle = "Contacto, ubicación y horario en San Ramón";
const contactDescription =
  "Contactá a Andy's Burger en San Juan de San Ramón, Alajuela. Consultá ubicación, horario, teléfono, pedidos para llevar y entrega de hamburguesas a domicilio.";
const contactImage = siteImages.homeHero;

const openingHours = [
  { day: "Lunes", hours: "5:00–10:30 p. m." },
  { day: "Martes", hours: "6:30–10:00 p. m." },
  { day: "Miércoles", hours: "5:00–10:30 p. m." },
  { day: "Jueves", hours: "5:00–10:30 p. m." },
  { day: "Viernes", hours: "5:00–10:30 p. m." },
  { day: "Sábado", hours: "12:00–10:30 p. m." },
  { day: "Domingo", hours: "12:00–10:30 p. m." },
] as const;

export const metadata: Metadata = {
  title: contactTitle,
  description: contactDescription,
  keywords: [
    "contacto Andy's Burger",
    "ubicación Andy's Burger San Ramón",
    "horario Andy's Burger San Ramón",
    "hamburguesería en San Ramón",
    "hamburguesas San Juan San Ramón",
    "hamburguesas a domicilio San Ramón",
    "servicio exprés hamburguesas San Ramón",
    "hamburguesas para llevar San Ramón",
    "pedir hamburguesas en San Ramón",
    "Andy’s Burger Alajuela",
  ],
  category: "Hamburguesería",
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
    title: `${contactTitle} | Andy's Burger`,
    description: contactDescription,
    type: "website",
    locale: "es_CR",
    siteName: "Andy's Burger",
    images: [
      {
        url: contactImage.social.src,
        width: contactImage.social.width,
        height: contactImage.social.height,
        alt: contactImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${contactTitle} | Andy's Burger`,
    description: contactDescription,
    images: [contactImage.social.src],
  },
};

const contactStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "#pagina-contacto",
      name: "Contacto y ubicación de Andy's Burger en San Ramón",
      description: contactDescription,
      inLanguage: "es-CR",
      mainEntity: { "@id": "#andys-burger" },
    },
    {
      "@type": "FastFoodRestaurant",
      "@id": "#andys-burger",
      name: "Andy's Burger",
      description:
        "Hamburguesería en San Juan de San Ramón con pedidos para llevar y entrega de hamburguesas a domicilio en San Ramón, Alajuela.",
      image: contactImage.seoSrc,
      telephone: "+50686510588",
      priceRange: "₡₡",
      currenciesAccepted: "CRC",
      servesCuisine: ["Hamburguesas", "Comida rápida"],
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Del Jardín de Niños de San Juan, 25 m norte y 25 m este, calle de lastre",
        addressLocality: "San Juan",
        addressRegion: "San Ramón, Alajuela",
        postalCode: "20201",
        addressCountry: "CR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 10.1056999,
        longitude: -84.4650583,
      },
      hasMap: googleMapsUrl,
      areaServed: {
        "@type": "City",
        name: "San Ramón, Alajuela",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "https://schema.org/Monday",
          opens: "17:00",
          closes: "22:30",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "https://schema.org/Tuesday",
          opens: "18:30",
          closes: "22:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "https://schema.org/Wednesday",
            "https://schema.org/Thursday",
            "https://schema.org/Friday",
          ],
          opens: "17:00",
          closes: "22:30",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "https://schema.org/Saturday",
            "https://schema.org/Sunday",
          ],
          opens: "12:00",
          closes: "22:30",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 5,
        reviewCount: 6,
        bestRating: 5,
      },
      sameAs: [
        "https://www.instagram.com/andy.sburger/",
        "https://www.tiktok.com/@andy.sburger",
        "https://www.facebook.com/people/Andys-Burger/61567575252356/",
      ],
      potentialAction: {
        "@type": "OrderAction",
        target: whatsappUrl,
      },
    },
  ],
};

export default function ContactoPage() {
  return (
    <main className="route-shell contact-page" aria-labelledby="contacto-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactStructuredData).replace(/</g, "\\u003c"),
        }}
      />

      <header className="contact-page__hero">
        <p>Andy&apos;s Burger · San Juan de San Ramón</p>
        <h1 id="contacto-title">
          Contacto y ubicación de Andy&apos;s Burger en San Ramón
        </h1>
        <span>
          Pedí hamburguesas al grill para llevar o recibir a domicilio en San
          Ramón, Alajuela. Encontrá aquí nuestro teléfono, horario y ubicación
          exacta para retirar tu pedido.
        </span>
        <div className="contact-page__actions" aria-label="Opciones de contacto">
          <a
            className="contact-page__button contact-page__button--whatsapp"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            <span>Pedir por WhatsApp</span>
          </a>
          <a className="contact-page__button" href={businessPhoneHref}>
            Llamar al negocio
          </a>
          <a
            className="contact-page__button contact-page__button--dark"
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Cómo llegar
          </a>
        </div>
      </header>

      <section className="contact-location" aria-labelledby="location-title">
        <div className="contact-location__map">
          <iframe
            src={googleMapsEmbedUrl}
            title="Mapa de Andy's Burger en San Juan de San Ramón, Alajuela"
            width="600"
            height="450"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <div className="contact-location__details">
          <p>Ubicación en San Ramón</p>
          <h2 id="location-title">Encontrá Andy&apos;s Burger en San Juan</h2>
          <address>
            Del Jardín de Niños de San Juan, 25 metros norte y 25 metros este,
            en la calle de lastre, detrás de la Escuela de San Juan.
            <br />
            San Juan, San Ramón, Alajuela 20201, Costa Rica.
          </address>

          <dl>
            <div>
              <dt>Teléfono oficial</dt>
              <dd>
                <a href={businessPhoneHref}>{businessPhone}</a>
              </dd>
            </div>
            <div>
              <dt>Modalidad</dt>
              <dd>Ventanilla para llevar y entrega a domicilio</dd>
            </div>
            <div>
              <dt>Zona de entrega</dt>
              <dd>San Ramón, Alajuela</dd>
            </div>
            <div>
              <dt>Estacionamiento</dt>
              <dd>Disponible en la calle pública</dd>
            </div>
            <div>
              <dt>Consumo promedio</dt>
              <dd>Aproximadamente ₡6 000 por persona</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="contact-hours" aria-labelledby="hours-title">
        <div className="contact-hours__heading">
          <p>Horario de atención</p>
          <h2 id="hours-title">Horario de Andy&apos;s Burger en San Ramón</h2>
          <span>
            Consultá nuestro horario antes de pedir hamburguesas para llevar o
            solicitar servicio exprés en San Ramón.
          </span>
        </div>

        <dl className="contact-hours__list">
          {openingHours.map(({ day, hours }) => (
            <div key={day}>
              <dt>{day}</dt>
              <dd>{hours}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="contact-services" aria-labelledby="services-title">
        <div className="contact-services__heading">
          <p>Elegí cómo recibir tu pedido</p>
          <h2 id="services-title">Hamburguesas para llevar y a domicilio</h2>
        </div>

        <div className="contact-services__grid">
          <article>
            <span aria-hidden="true">01</span>
            <h3>Pedidos para llevar</h3>
            <p>
              Encargá tu hamburguesa y retirala en nuestra ventanilla en San
              Juan de San Ramón.
            </p>
          </article>
          <article>
            <span aria-hidden="true">02</span>
            <h3>Entrega a domicilio</h3>
            <p>
              Consultá la disponibilidad de servicio exprés para recibir tu
              pedido dentro de San Ramón.
            </p>
          </article>
          <article>
            <span aria-hidden="true">03</span>
            <h3>Pedido directo por WhatsApp</h3>
            <p>
              Enviá tu selección y confirmaremos disponibilidad, cobertura y
              total final antes de preparar el pedido.
            </p>
          </article>
        </div>

        <a
          className="contact-page__button contact-page__button--whatsapp contact-services__cta"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon />
          <span>Contactar por WhatsApp</span>
        </a>
      </section>
    </main>
  );
}
