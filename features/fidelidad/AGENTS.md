# Desarrollo del módulo Fidelidad

## Ubicación y ramas

Trabajar desde la raíz del repositorio `andys-burger-website`.
El trabajo nuevo corresponde a `desarrollo/bd/fidelidad`.
`respaldo/google` conserva el código inicial con Google Sheets, commit `d88e283`.
`master` es la rama vinculada a producción. Las ramas conservan código, no datos ni variables privadas.

## Preparación existente

La entrada en `features/admin-shell/modules.ts` lleva a `/admin/fidelidad`.
La página está dentro de `app/admin/(protected)` y reutiliza `requireAdmin`.
El módulo tiene estilos propios en `workspace.module.css`.
Actualmente la página presenta el estado de preparación y no hace consultas ni escrituras.

## Contexto de AB Sistema de fidelidad

- El cliente registra nombre, apellido, celular y fecha de nacimiento.
- El celular es el identificador de búsqueda único. La cédula fue descartada.
- El panel permitirá crear, consultar, editar y eliminar clientes.
- El personal registrará compras manualmente y podrá indicar qué compró en texto abierto.
- El sistema contará compras y contemplará un beneficio al llegar a diez.
- Quedan pendientes el detalle del beneficio, su canje y las reglas de reinicio del contador.
- Firebase o MongoDB está pendiente de elección por el usuario.

## Integración

Desarrollar la interfaz, lógica y acceso a datos de fidelidad dentro de `features/fidelidad`.
Las rutas de página corresponden a `app/admin/(protected)/fidelidad`.
Si se agregan rutas de datos, usar `/admin/api/fidelidad`, validando sesión y origen para las escrituras como en el panel existente.
Utilizar estilos CSS Modules para evitar conflictos con Facturas y Website.
En el prototipo pueden utilizarse datos ficticios en memoria, indicando que se pierden al recargar.
El almacenamiento definitivo y la migración deben acordarse antes de conectarlos.
Fidelidad tendrá sus propias colecciones, repositorio de datos y configuración. No reutilizar las hojas, Apps Script ni claves Redis de facturas y precios para los clientes o las compras de fidelidad.
No guardar datos personales reales o credenciales en el repositorio público.
Conservar el comportamiento de los módulos actuales mientras se prepara la migración.

## Verificación

Ejecutar lint, compilación y las pruebas de integración existentes.
Comprobar acceso autenticado a Fidelidad, redirección sin sesión y funcionamiento de Facturas y Website.
Las pruebas usan servicios simulados para evitar escribir en datos reales.
