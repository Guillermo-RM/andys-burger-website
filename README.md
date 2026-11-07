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

## Precios administrados

Para guardar los precios en Google Sheets, usá un documento privado con una
pestaña `Precios` y las columnas `ID`, `Producto`, `Categoría` y `Precio (CRC)`.
Mantené los IDs del catálogo y usá números enteros para los precios.

En un proyecto independiente de Apps Script, pegá `scripts/menu-prices.gs`.
En las propiedades del script guardá `MENU_SHEET_ID` con el ID del documento y
`MENU_SHEETS_SECRET` con un secreto aleatorio. Implementá el script como
aplicación web, ejecutada por el propietario con acceso al documento, y permití
el acceso a cualquiera para que el servidor de Vercel pueda enviar el secreto
en cada solicitud. En Vercel guardá `MENU_SHEETS_SCRIPT_URL` con la URL
`/exec` y `MENU_SHEETS_SECRET` con el mismo secreto.

Sin Google Sheets configurado, el panel guarda cambios por ID de producto en Redis. La parte pública usa
`MENU_REDIS_READ_TOKEN` para leer y el editor usa `MENU_REDIS_TOKEN` para
guardar. Configurá también `MENU_REDIS_URL` y `MENU_PRICE_KEY` según
`.env.example`. Los tokens se usan solo en el servidor.

`/api/menu/catalog` y el editor usan el mismo catálogo de referencia.
Conservá los IDs al cambiar los nombres o las descripciones. La portada, el menú, los
datos estructurados y el texto de descubrimiento usan los precios publicados
en cada solicitud. Sin la configuración Redis, se usan los
precios base definidos en el catálogo.

## Panel administrativo

`/admin` abre el inicio de sesión. La sesión protege `/admin/facturas`,
`/admin/website` y las operaciones bajo `/admin/api`. Facturas usa las
hojas y el Apps Script existentes.

Configurá `APP_ORIGIN=https://andysburger.com` en el proyecto de Vercel.
Usá un Redis separado para las sesiones con `AUTH_REDIS_URL` y
`AUTH_REDIS_TOKEN`. Generá un `SESSION_SECRET` aleatorio de al menos 32
bytes y el `ADMIN_PASSWORD_HASH` con
`node --experimental-strip-types scripts/hash-password.ts`. El script recibe
la contraseña por entrada estándar. Configurá las variables de Google según
`.env.example` y conservá los IDs por año del sistema existente si los usa.

Ejecutá `npm run build` y luego `npm run test:integration` para comprobar el
sitio y el panel bajo el mismo origen con Redis y Apps Script simulados.
