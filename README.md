# Andy’s Burger

Sitio web y panel administrativo para una hamburguesería de San Ramón, Alajuela, Costa Rica. El proyecto reúne el catálogo y los pedidos por WhatsApp con herramientas internas para actualizar precios y gestionar registros de facturas.

## Experiencia del cliente

El sitio presenta el menú con fotografías, ingredientes, precios y opciones de personalización. El cliente arma su pedido, ajusta las cantidades y lo envía por WhatsApp para que el negocio confirme la disponibilidad y el total. El sitio también reúne la ubicación, los horarios y las reseñas. [Ver sitio público](https://andysburger.com/)

## Operación del negocio

- **Precios del menú.** El personal puede actualizar precios desde el panel y publicarlos en el catálogo sin modificar el código. El editor avisa si el precio cambió desde que se abrió el formulario, para evitar sobrescribir otra actualización.
- **Facturas.** El panel permite consultar los registros por período, revisar indicadores y registrar facturas manualmente. La integración aprovecha las hojas de cálculo que el negocio ya utiliza.
- **Acceso administrativo.** El sitio y el panel comparten la aplicación. Las funciones internas requieren una sesión autenticada.

## Implementación

- **Next.js, React y TypeScript** para el catálogo público y el panel.
- **Google Sheets y Apps Script** para integrar los datos del negocio, con **Redis** como alternativa para almacenar los precios.
- **Cloudinary** para las imágenes del catálogo, **Google Tag Manager** para medir interacciones con WhatsApp y **Vercel** para el alojamiento.
- **Pruebas de integración** que cubren la protección del panel y la publicación de precios con servicios externos simulados.
