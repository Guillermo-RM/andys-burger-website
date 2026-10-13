# Andy's Burger

Sitio oficial de Andy's Burger, hamburguesas en San Ramón, Alajuela.

## Desarrollo local

Requiere Node.js 22.

```bash
npm install
npm run dev
```

La URL base usada para canonicals, sitemap, robots y datos estructurados se
configura mediante `NEXT_PUBLIC_SITE_URL`. En local se utiliza
`http://localhost:3000`.

Para producción en Vercel se utilizan:

```powershell
$env:NEXT_PUBLIC_SITE_URL="https://andysburger.com"
$env:NEXT_PUBLIC_GTM_ID="GTM-KLLPKKG3"
npm run build
```

Google Tag Manager está integrado globalmente con el contenedor
`GTM-KLLPKKG3`. Si el contenedor cambia, puede configurarse sin modificar el
código:

```powershell
$env:NEXT_PUBLIC_GTM_ID="GTM-XXXXXXXX"
```

## Comandos

- `npm run dev`: inicia el entorno de desarrollo.
- `npm run build`: genera y valida la compilación de producción.
- `npm run start`: inicia la compilación de producción.
- `npm run lint`: revisa la calidad del código.

## Despliegue en Vercel

El proyecto utiliza Next.js nativo y no necesita un archivo `vercel.json`.
Vercel debe detectar automáticamente el framework y ejecutar `npm run build`.

Configura en Vercel, para Producción, Preview y Desarrollo:

- `NEXT_PUBLIC_SITE_URL=https://andysburger.com`
- `NEXT_PUBLIC_GTM_ID=GTM-KLLPKKG3`

Después de conectar el dominio, redirige `www.andysburger.com` hacia
`andysburger.com` para conservar una sola URL canónica.

## Estructura principal

- `app/`: páginas, metadata y estilos globales.
- `components/`: navegación, menús, carrito, reseñas y footer.
- `lib/`: información del menú, branding e imágenes de Cloudinary.
- `public/`: recursos públicos locales.
- `BRANDING.md`: decisiones de marca, contenido y SEO del proyecto.

## Descubrimiento e indexación

- `/sitemap.xml`: páginas canónicas e imágenes principales.
- `/robots.txt`: acceso para buscadores y rastreadores de IA.
- `/llms.txt`: resumen oficial del negocio para asistentes.
- `/llms-full.txt`: ficha completa, menú, precios, ingredientes y reglas de precisión.
