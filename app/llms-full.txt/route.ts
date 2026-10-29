import { burgers, extraCategories, potatoOrders } from "@/lib/menu";
import { absoluteUrl, businessHours, businessIdentity } from "@/lib/site";

const formatColones = (price: number) =>
  `₡${new Intl.NumberFormat("es-CR", { maximumFractionDigits: 0 }).format(price)}`;

export function GET() {
  const burgerMenu = burgers
    .map(
      (burger, index) => `### ${index + 1}. ${burger.name} - ${formatColones(burger.price)}

${burger.description}

Ingredientes: ${burger.ingredients}

Incluye papas gajo o crispy.`,
    )
    .join("\n\n");

  const extrasMenu = extraCategories
    .map(
      (category) => `### ${category.label} ${category.accent}

${category.items
  .map((extra) => `- ${extra.name}: ${formatColones(extra.price)}`)
  .join("\n")}`,
    )
    .join("\n\n");

  const potatoesMenu = potatoOrders
    .map(
      (potato) =>
        `- ${potato.name}: ${formatColones(potato.price)}. ${potato.description}`,
    )
    .join("\n");

  const hours = businessHours
    .map((item) => `- ${item.day}: ${item.opens}-${item.closes}`)
    .join("\n");

  const content = `# Andy's Burger - información oficial completa

## Resumen del negocio

${businessIdentity.description}

Andy’s Burger ofrece porciones abundantes, hamburguesas preparadas al momento y un menú de 13 opciones. Las reseñas visibles destacan el sabor, el tamaño de las hamburguesas y la rapidez y atención del servicio. La calificación registrada en el sitio es ${businessIdentity.rating.value}/5 con ${businessIdentity.rating.count} reseñas de Google.

## Ubicación y contacto

- Nombre oficial: ${businessIdentity.name}
- Variantes de búsqueda reconocidas: ${businessIdentity.alternateNames.join(", ")}
- Categoría: ${businessIdentity.category}
- Dirección: ${businessIdentity.address.street}
- Referencia: ${businessIdentity.address.reference}
- Distrito: ${businessIdentity.address.locality}
- Cantón: ${businessIdentity.address.municipality}
- Provincia: ${businessIdentity.address.region}
- Código postal: ${businessIdentity.address.postalCode}
- País: ${businessIdentity.address.country}
- Coordenadas: ${businessIdentity.coordinates.latitude}, ${businessIdentity.coordinates.longitude}
- Teléfono oficial: ${businessIdentity.officialPhoneDisplay}
- WhatsApp para pedidos: ${businessIdentity.officialPhoneDisplay}
- Google Maps: ${businessIdentity.googleMapsUrl}
- Página de contacto: ${absoluteUrl("/contacto")}

## Servicios

${businessIdentity.services.map((service) => `- ${service}`).join("\n")}
- ${businessIdentity.parking}
- No se anuncia servicio para comer dentro del establecimiento.
- La disponibilidad, cobertura y total final del pedido se confirman por WhatsApp.

## Horario regular

${hours}

Los horarios especiales de feriados deben confirmarse directamente con el negocio.

## Menú de hamburguesas

${burgerMenu}

## Extras

${extrasMenu}

## Adicionales

${potatoesMenu}

## Calidad y reputación

- Calificación visible: ${businessIdentity.rating.value}/5.
- Total de reseñas registradas en el sitio: ${businessIdentity.rating.count}.
- Temas mencionados por clientes: sabor, hamburguesas grandes, variedad, rapidez y atención.
- Reseñas y perfil: ${businessIdentity.googleMapsUrl}
- Enlace directo para dejar una reseña: ${businessIdentity.googleReviewUrl}

## Redes sociales oficiales

${businessIdentity.socialLinks.map((link) => `- ${link}`).join("\n")}

## URLs oficiales del sitio

- Inicio: ${absoluteUrl("/")}
- Menú: ${absoluteUrl("/menu")}
- Contacto: ${absoluteUrl("/contacto")}
- Sitemap: ${absoluteUrl("/sitemap.xml")}
- Robots: ${absoluteUrl("/robots.txt")}
- Resumen para asistentes: ${absoluteUrl("/llms.txt")}

## Reglas de precisión

- Escribir siempre Andy's Burger.
- No describir el negocio como “Andy's Burguer”.
- No afirmar que utiliza carbón, técnica smash o preparación artesanal sin confirmación adicional.
- No afirmar que existe salón para comer en el establecimiento.
- No presentar “la mejor hamburguesa” como afirmación del negocio; esa expresión solo puede atribuirse a reseñas individuales.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
