# Pruebas de la Evaluación 1

Desde NombreRepositorio:

- npm run test:dom: inventario de tres casos por componente, compilación de pruebas JSX y ejecución Jasmine/Karma en jsdom.
- npm test: la misma suite en ChromeHeadless (requiere Chrome instalado).
- npm run test:api: pruebas de integración HTTP en Node, en almacenamiento temporal separado por caso.
- npm run build: compila las nueve entradas HTML para producción.

La suite comprende **87 casos Jasmine**: 78 de los 26 componentes inventariados y nueve del servicio original. Se conservan los casos anteriores; se ajustaron las expectativas de navegación y contacto para los nuevos requisitos. En contacto, el caso válido espera a que el servidor confirme el guardado simulado antes de comprobar el modal. El informe por caso se escribe en reports/resultado-pruebas.json.

| Cobertura funcional nueva | Qué se comprueba |
|---|---|
| Ficha y tienda | Enlace al detalle, cantidad persistida, falta de stock, detalle por código y ausencia de producto. |
| Cuenta y formulario | Credenciales inválidas, error remoto, registro sin rol, sesión, vínculo región-comuna. |
| Carrito | Vacío, acceso con retorno al carrito y confirmación que limpia después del éxito. |
| Administración | Denegación al cliente, menú del vendedor, formulario del administrador. |
| Información | Equipo, dos artículos y lectura de detalle. |
| API HTTP: 9 casos | RUN y límites de perfil, duplicados, permisos y bloqueo de escalada de rol, CRUD de productos, compra con sesión, precios del servidor, inventario atómico, consulta de mensajes y cierre de sesión. Dos pedidos simultáneos por una unidad producen una sola venta. |

La cobertura indicada es de comportamientos. No representa un porcentaje de líneas o ramas. La persistencia remota en Vercel/Upstash requiere una verificación separada con las credenciales del proyecto.


Evidencia de esta entrega: las 87 pruebas pasaron en jsdom y en Chromium Headless. Las 9 pruebas HTTP pasaron. En Chromium también se comprobó un pedido desde catálogo y detalle, registro con retorno al carrito, acceso de administrador y lectura del detalle de esa orden, a 390 y 1280 px. Informes en evidencia/.
