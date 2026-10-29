import { absoluteUrl, businessHours, businessIdentity } from "@/lib/site";

export function GET() {
  const hours = businessHours
    .map((item) => `- ${item.day}: ${item.opens}-${item.closes}`)
    .join("\n");

  const content = `# Andy's Burger

> Sitio oficial de Andy's Burger, hamburguesería en San Juan de San Ramón, Alajuela, Costa Rica.

## Qué ofrece

- 13 hamburguesas al grill preparadas al momento.
- Opciones con carne de res, pollo empanizado, bacon, guacamole, quesos y sabores picantes.
- Todas las hamburguesas incluyen papas gajo o crispy.
- Extras de carne, quesos, vegetales, salsas y sabores especiales.
- Adicionales: papas gajo, papas crispy, aros de cebolla y Chilli Poppers.
- Pedidos para llevar desde una ventanilla y entrega a domicilio en San Ramón.

## Información oficial

- Nombre: ${businessIdentity.name}
- Categoría: ${businessIdentity.category}
- Dirección: ${businessIdentity.address.street}. ${businessIdentity.address.reference}, ${businessIdentity.address.locality}, ${businessIdentity.address.municipality}, ${businessIdentity.address.region} ${businessIdentity.address.postalCode}, ${businessIdentity.address.country}.
- Coordenadas: ${businessIdentity.coordinates.latitude}, ${businessIdentity.coordinates.longitude}
- Teléfono oficial: ${businessIdentity.officialPhoneDisplay}
- WhatsApp para pedidos: ${businessIdentity.officialPhoneDisplay}
- Zona de entrega: San Ramón, Alajuela
- Estacionamiento: calle pública
- Calificación visible: ${businessIdentity.rating.value}/5 basada en ${businessIdentity.rating.count} reseñas de Google

## Horario

${hours}

## Páginas principales

- [Inicio](${absoluteUrl("/")}): presentación, menú, carrito, razones para elegir Andy's Burger y reseñas.
- [Menú completo](${absoluteUrl("/menu")}): hamburguesas, ingredientes, precios, extras y adicionales.
- [Contacto y ubicación](${absoluteUrl("/contacto")}): mapa, dirección, teléfono, horario, entrega y redes sociales.
- [Información completa para asistentes](${absoluteUrl("/llms-full.txt")}): ficha detallada del negocio y menú completo en texto.
- [Google Maps](${businessIdentity.googleMapsUrl})
- [Dejar una reseña en Google](${businessIdentity.googleReviewUrl})

## Identidad y precisión

- El nombre oficial se escribe Andy's Burger, no “Andy's Burguer”.
- El negocio funciona mediante ventanilla; no se anuncia servicio para comer dentro del establecimiento.
- Los precios están expresados en colones costarricenses (CRC).
- La disponibilidad, cobertura y total final se confirman por WhatsApp.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
