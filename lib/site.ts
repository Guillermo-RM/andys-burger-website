import {
  burgerImages,
  createImageStructuredData,
  siteImages,
} from "@/lib/images";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "https://andys-burger-website.vercel.app";

export const siteUrl = new URL(configuredSiteUrl).origin;
export const siteLastModified = new Date("2026-08-04T00:00:00-06:00");

export const absoluteUrl = (path = "/") =>
  new URL(path, `${siteUrl}/`).toString();

export const businessIdentity = {
  name: "Andy's Burger",
  alternateNames: ["Andys Burger", "Andy Burger"],
  category: "Hamburguesería",
  description:
    "Andy's Burger es una hamburguesería en San Juan de San Ramón, Alajuela, con 13 hamburguesas al grill preparadas al momento, extras y órdenes de papas para llevar o recibir a domicilio.",
  shortDescription:
    "Hamburguesas al grill preparadas al momento en San Juan de San Ramón, Alajuela.",
  officialPhone: "+50686510588",
  officialPhoneDisplay: "+506 8651 0588",
  address: {
    street:
      "Del Jardín de Niños de San Juan, 25 m norte y 25 m este, calle de lastre",
    reference: "Detrás de la Escuela de San Juan",
    locality: "San Juan",
    municipality: "San Ramón",
    region: "Alajuela",
    postalCode: "20201",
    country: "Costa Rica",
    countryCode: "CR",
  },
  coordinates: {
    latitude: 10.1056999,
    longitude: -84.4650583,
  },
  services: [
    "Pedidos para llevar desde una ventanilla",
    "Entrega a domicilio en San Ramón",
    "Pedidos directos por WhatsApp",
  ],
  parking: "Estacionamiento disponible en la calle pública",
  googleMapsUrl:
    "https://www.google.com/maps/place/Andy's+Burger/data=!4m2!3m1!1s0x0:0xcace868bb64699d6",
  googleReviewUrl: "https://g.page/r/CdaZRraLhs7KEBM/review",
  socialLinks: [
    "https://www.instagram.com/andy.sburger/",
    "https://www.tiktok.com/@andy.sburger",
    "https://www.facebook.com/people/Andys-Burger/61567575252356/",
  ],
  rating: {
    value: 5,
    count: 6,
    best: 5,
  },
} as const;

export const businessHours = [
  { day: "Lunes", opens: "17:00", closes: "22:30" },
  { day: "Martes", opens: "18:30", closes: "22:00" },
  { day: "Miércoles", opens: "17:00", closes: "22:30" },
  { day: "Jueves", opens: "17:00", closes: "22:30" },
  { day: "Viernes", opens: "17:00", closes: "22:30" },
  { day: "Sábado", opens: "12:00", closes: "22:30" },
  { day: "Domingo", opens: "12:00", closes: "22:30" },
] as const;

const schemaDayUrls = {
  Lunes: "https://schema.org/Monday",
  Martes: "https://schema.org/Tuesday",
  Miércoles: "https://schema.org/Wednesday",
  Jueves: "https://schema.org/Thursday",
  Viernes: "https://schema.org/Friday",
  Sábado: "https://schema.org/Saturday",
  Domingo: "https://schema.org/Sunday",
} as const;

export const businessId = absoluteUrl("/#andys-burger");
export const websiteId = absoluteUrl("/#website");
export const menuId = absoluteUrl("/menu#menu-hamburguesas");

export const businessStructuredData = {
  "@type": "FastFoodRestaurant",
  "@id": businessId,
  url: absoluteUrl("/"),
  name: businessIdentity.name,
  alternateName: businessIdentity.alternateNames,
  description: businessIdentity.description,
  slogan: "Hamburguesas al grill en San Ramón, preparadas al momento",
  image: [
    createImageStructuredData(siteImages.homeHero, {
      representativeOfPage: true,
    }),
    ...Object.values(burgerImages).map((image) =>
      createImageStructuredData(image),
    ),
  ],
  telephone: businessIdentity.officialPhone,
  priceRange: "₡₡",
  currenciesAccepted: "CRC",
  servesCuisine: ["Hamburguesas", "Comida rápida"],
  hasMenu: menuId,
  address: {
    "@type": "PostalAddress",
    streetAddress: businessIdentity.address.street,
    addressLocality: businessIdentity.address.locality,
    addressRegion: `${businessIdentity.address.municipality}, ${businessIdentity.address.region}`,
    postalCode: businessIdentity.address.postalCode,
    addressCountry: businessIdentity.address.countryCode,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: businessIdentity.coordinates.latitude,
    longitude: businessIdentity.coordinates.longitude,
  },
  hasMap: businessIdentity.googleMapsUrl,
  areaServed: {
    "@type": "City",
    name: "San Ramón, Alajuela",
  },
  openingHoursSpecification: businessHours.map((hours) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: schemaDayUrls[hours.day],
    opens: hours.opens,
    closes: hours.closes,
  })),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: businessIdentity.rating.value,
    reviewCount: businessIdentity.rating.count,
    bestRating: businessIdentity.rating.best,
  },
  sameAs: businessIdentity.socialLinks,
  potentialAction: {
    "@type": "OrderAction",
    target: `https://wa.me/${businessIdentity.officialPhone.replace("+", "")}`,
    areaServed: "San Ramón, Alajuela, Costa Rica",
  },
};

export const websiteStructuredData = {
  "@type": "WebSite",
  "@id": websiteId,
  url: absoluteUrl("/"),
  name: "Andy's Burger",
  alternateName: "Hamburguesas San Ramón",
  description: businessIdentity.description,
  inLanguage: "es-CR",
  publisher: { "@id": businessId },
  about: { "@id": businessId },
};
