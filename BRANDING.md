# Andy's Burger — Guía de branding

Este documento reúne las decisiones visuales y de estructura que deben respetarse en todo el proyecto.

## Marca

- Nombre oficial: **Andy's Burger**
- La palabra **Burger** se destaca con el color Naranja Andy's.
- El logotipo oficial se carga desde Cloudinary.
- El logotipo permanece oculto temporalmente en el topbar; su URL se conserva para uso posterior.

## Paleta de colores

| Nombre | Hexadecimal | Uso |
| --- | --- | --- |
| Negro profundo | `#010101` | Fondos principales |
| Negro carbón | `#121414` | Texturas, degradados y zonas iluminadas |
| Blanco cálido | `#FDFDFD` | Títulos, logotipo y textos principales |
| Naranja Andy's | `#F99804` | Palabra “Burger”, acentos y llamados de atención |

No se deben introducir colores fuera de esta paleta salvo indicación expresa.

## Tipografía

- Familia principal: **Nunito**
- Fuente: https://fonts.google.com/specimen/Nunito
- Se utiliza para textos, títulos y navegación.

## Imágenes

- Las imágenes se alojarán en Cloudinary.
- Cada enlace debe declararse como una variable centralizada antes de utilizarse en un componente.
- Las variables de imagen del branding se encuentran en `lib/brand.ts`.
- Las imágenes de contenido y sus datos SEO se registran en `lib/images.ts`.
- Cloudinary entrega automáticamente el formato y calidad adecuados mediante `f_auto` y `q_auto`; no es necesario convertir manualmente el archivo original.
- Cada imagen de contenido debe incluir nombre semántico, ancho, alto, texto alternativo y descripción.
- Las imágenes importantes se renderizan con `next/image`, nunca únicamente como fondos CSS.
- Logotipo: `https://res.cloudinary.com/dhoho4qse/image/upload/v1785792900/logo-fondo-negro-fuente-blanca_g5tazo.jpg`
- Hero: `https://res.cloudinary.com/dhoho4qse/image/upload/v1785799698/hamburguesa-artesanal-andys-burger-san-ramon_kjetsu.png`

## Estructura del sitio

- `/` — Home
- `/menu` — Menú
- `/contacto` — Contacto

Todas las páginas y componentes deben ser completamente responsive.

## Home — estructura acordada

### Topbar

- Fondo Negro profundo.
- Posición sticky.
- El logotipo no se muestra por el momento.
- Nombre Andy's Burger dentro de un `h2` junto al logotipo.
- La palabra Burger utiliza Naranja Andy's.
- Navegación hacia Inicio, Menú y Contacto.
- Los enlaces utilizan peso tipográfico Medium (`500`).
- Menú adaptable para pantallas móviles.
- Los enlaces del menú móvil se muestran centrados.
- El topbar forma parte del layout persistente del sitio; el contenido central cambia al navegar.
- El footer se incorporará posteriormente dentro del mismo layout persistente.

### Hero

- Utiliza la imagen de Cloudinary mediante `next/image`, posicionada visualmente como fondo pero indexable por buscadores.
- Tiene una altura de `70vh`.
- La imagen se adapta con `object-fit: cover` y se mantiene centrada.
- Se entrega en tamaños responsive con formato y calidad automáticos.
- Incluye dimensiones, texto alternativo, descripción, Open Graph, X Card y datos estructurados `ImageObject`.
- La fotografía utiliza una capa de Negro profundo al `20%`.
- Mensaje centrado con keyword secundaria: **Hamburguesas al grill en San Ramón, preparadas al momento**.
- El mensaje del hero es un párrafo visual; el hero no contiene el `h1`.
- El título utiliza una franja horizontal de ancho completo en Negro profundo semitransparente.
- La franja del título aplica un desenfoque de fondo de `3px`.
- El botón **Andy's Menú** se encuentra dentro de la franja desenfocada y enlaza a Menú.
- En reposo, **Andy's** utiliza Blanco cálido y **Menú** Naranja Andy's.
- En hover, el botón utiliza fondo Blanco cálido, borde Negro profundo y ambas palabras en Negro profundo.
- La transición del botón y sus textos dura `0.5s`.
- El título de la pestaña para Home es **Hamburguesas San Ramón**.

### SEO local

- Palabra principal: **hamburguesas a la parrilla en San Ramón**.
- Palabra secundaria: **hamburguesas San Ramón**.
- H1 fuera del hero: **Hamburguesas San Ramón**.
- El Home presenta las 13 hamburguesas como tarjetas tanto en desktop como en
  móvil. Cada tarjeta incluye imagen, nombre, precio, selección e ingredientes
  desplegables.
- Los extras se presentan después de las hamburguesas en cinco categorías:
  carne, especiales, vegetales, salsas y aderezos, y dulces.
- En desktop, las categorías se distribuyen en dos columnas independientes sin
  espacios verticales forzados; cada producto incorpora un emoji como referencia
  visual. En móvil vuelven a una sola columna con orden lógico.
- Cada extra muestra nombre, precio y selección directa; utiliza el mismo
  carrito, controles de cantidad y pedido por WhatsApp que las hamburguesas.
- El carrito agrupa los productos por tipo: **Hamburguesas** permanece siempre
  como primer bloque y **Extras** aparece con un separador cuando contiene
  productos. La estructura admite nuevas categorías de pedido.
- La tercera categoría es **Órdenes de papas**: papas gajo por ₡2 300 y papas
  crispy por ₡2 000. Aparece como bloque independiente en el carrito cuando se
  selecciona una orden.
- En desktop, el carrito sticky acompaña tanto la sección de hamburguesas como
  la de extras. En tablet y móvil conserva su variante flotante.
- La selección de hamburguesas funciona por clic, no por hover.
- Cada hamburguesa puede agregarse al carrito, modificar su cantidad o eliminarse.
- El pedido se prepara como mensaje de WhatsApp para el número temporal
  +506 8974-2305.
- En desktop, el carrito permanece visible como columna sticky a la derecha.
- Los botones utilizan fondo blanco o naranja. El botón de pedido es la única
  excepción y utiliza el verde de WhatsApp `#25D366` con hover blanco.
- Los botones incorporan transiciones suaves; las acciones de eliminación usan
  naranja y cambian a blanco al interactuar.
- El carrito no muestra precios ni calcula un total estimado; WhatsApp confirma
  el total final.
- El mensaje de pedido incluye únicamente los nombres y cantidades almacenados
  en la selección.
- El mensaje de WhatsApp presenta cada producto como
  `- Nombre, Cantidad: número`.
- Las 13 hamburguesas utilizan imágenes individuales alojadas en Cloudinary,
  registradas como variables con nombre, texto alternativo y descripción SEO.
- Las imágenes del menú se entregan en formato automático, calidad 65, ancho
  responsive y carga diferida para reducir su peso inicial.
- Mientras carga una hamburguesa se muestra un spinner naranja con el mensaje
  **Tanto sabor pesa**.
- El menú incorpora datos estructurados `Menu`, `MenuSection`, `MenuItem`,
  `Offer` e `ImageObject` para sus 13 hamburguesas.
- En móvil, las hamburguesas se presentan como tarjetas en una cuadrícula de dos
  columnas. Cada tarjeta incluye imagen, nombre, precio y casilla de selección.
- Los ingredientes de cada hamburguesa se despliegan dentro de su tarjeta al
  tocar la flecha, conservando listas con viñetas naranjas.
- La apertura y el cierre de ingredientes animan altura, opacidad,
  desplazamiento y rotación de la flecha; respetan la preferencia de movimiento
  reducido del dispositivo.
- Desde el breakpoint intermedio de `80rem`, el carrito sale del flujo del menú
  para evitar colisiones con la imagen y utiliza dos botones flotantes:
  selección arriba y WhatsApp abajo. La selección se abre como panel y se
  minimiza desde su cabecera o al tocar el fondo exterior.
- La keyword principal se reserva para el título SEO y contenido contextual, no para la frase del hero.
- Las variantes se distribuyen naturalmente entre Inicio, Menú, Contacto y metadatos de imágenes.
- No se utiliza la afirmación “la mejor hamburguesa” como un hecho no demostrado.
