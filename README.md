# Subdirección del kizazo · tienda de la Evaluación 1

Proyecto React con Bulma y Atomic Design. Conserva las cuatro páginas anteriores, el GIF, el video, la foca, los textos y el buzón local. Las nuevas vistas utilizan el mismo encabezado, navegación y pie. Son nueve entradas HTML en Vite; producto, registro, artículos y detalles se seleccionan por URL.

## Organización del código

React administra las vistas y el estado. Bulma es la única biblioteca de estilos: sus columnas, contenedores, botones, formularios y utilidades resuelven la interfaz. `src/styles/style.css` conserva únicamente ajustes del tema original y dimensiones particulares; no contiene otro sistema de cuadrículas. No se utilizan Bootstrap, Tailwind ni bibliotecas de componentes visuales.

| Carpeta | Responsabilidad |
|---|---|
| `src/components/atoms` | Controles básicos: Boton, Entrada, Imagen y Selector. |
| `src/components/molecules` | Grupos pequeños: campos con etiqueta y error, fichas, tarjetas y menú administrativo. |
| `src/components/organisms` | Secciones completas: navegación, formularios y catálogo. |
| `src/components/templates` | Plantilla común con encabezado, navegación y pie. |
| `src/components/pages` | Composición de cada página y coordinación de sus acciones. |
| `src/context` | Catálogo, sesión y carrito compartidos entre componentes. |
| `src/services` | Solicitudes HTTP, almacenamiento del carrito, validación y datos de referencia. |
| `server` y `api` | Persistencia, autenticación, autorización y operaciones del servidor. |
| `tests` | Pruebas organizadas por nivel de componentes, más servicios e integración HTTP. |
| `scripts` | Preparación local, compilación e inventario de las pruebas. |

Una página utiliza PlantillaPagina y compone organismos y moléculas; estos reutilizan átomos. Por ejemplo, FormularioTienda utiliza CampoSeleccion, que combina una etiqueta, un Selector y el mensaje de error. Inicio y Tienda reutilizan CatalogoProductos, que presenta las mismas FichaProducto. Los servicios y el contexto se mantienen fuera de Atomic Design porque no son elementos visuales.

La reorganización mantiene los datos, las validaciones, las funciones y las imágenes. Los comentarios se limitan a aclaraciones técnicas. Los iconos y textos originales de la interfaz se conservan.

## Ejecutar en tu equipo

Usa Node 22.12+ o Node 24. Abre una terminal en la carpeta **NombreRepositorio**, junto a este archivo:

```sh
npm ci
npm run dev
```

Abre la dirección que indique Vite. No abras el HTML con doble clic. Al primer arranque se crea una contraseña aleatoria en **.env.local** y se imprime una sola vez en la terminal. El correo local inicial es **admin@duoc.cl**. Si ya configuraste ADMIN_EMAIL y ADMIN_PASSWORD se respetan tus valores. El usuario inicial se crea en el primer acceso al servicio, solo si el almacén aún está vacío. Cambiar esas variables después no restablece una cuenta existente. Nunca subas .env.local a GitHub.

1. **Cliente:** Tienda → detalle → Añadir → Carrito → Inicia sesión para comprar → Crear una cuenta. Al registrarte desde el carrito vuelves al pedido. Confirmar genera una orden y descuenta stock; no realiza ningún cobro.
2. **Administrador:** Ingresar → Mi cuenta → Abrir administración. El menú contiene Productos, Usuarios, Órdenes y Mensajes. Crea o edita un producto, vuelve a Tienda y comprueba el cambio. Las bajas requieren confirmación.
3. **Vendedor:** créalo desde Usuarios con ese perfil. Cierra sesión y entra con su cuenta. Solo verá Productos y Órdenes en el panel; puede consultar el detalle, no modificar datos ni comprar.
4. **Contacto:** un envío válido queda en Mensajes del administrador. No se envían correos. Las sugerencias del buzón original siguen guardándose en el navegador.
5. **Nosotros y Blog:** accesibles desde el menú. El blog contiene dos notas, cada una con detalle.

Para revisar producción localmente:

```sh
npm run build
npm run preview
```

Vite sirve la pequeña API Node tanto en desarrollo como en preview. El archivo de datos predeterminado se ubica fuera del repositorio, en .subdireccion-tienda dentro de tu carpeta de usuario, separado por ruta del proyecto. En local usa un solo proceso de servidor por almacén. Puedes definir TIENDA_DB con la ruta de otro archivo para una demostración aislada. Usa datos ficticios para la evaluación.

## GitHub y Vercel

El ZIP mantiene NombreRepositorio como carpeta de la aplicación. Copia su contenido sobre la carpeta homónima de tu rama; revisa el diff y conserva la carpeta .git de tu repositorio. Esta entrega no publica cambios automáticamente.

En Vercel, Root Directory = **NombreRepositorio**, framework Vite, build **npm run build**, salida **dist**. El directorio **api/** debe permanecer junto al package.json en el repositorio; solo subir dist no incluye el servidor. La función api/index.js atiende las solicitudes del cliente. Para persistir en el despliegue, configura estas variables privadas y vuelve a desplegar:

| Variable | Valor |
|---|---|
| ADMIN_EMAIL | Correo inicial con uno de los tres dominios del anexo. |
| ADMIN_PASSWORD | Contraseña inicial de 4–10 caracteres (regla académica); utiliza 10 aleatorios. |
| UPSTASH_REDIS_REST_URL | Endpoint HTTPS de una base Redis Upstash para el proyecto. |
| UPSTASH_REDIS_REST_TOKEN | Token privado de lectura y escritura para esa base. |

No llevan prefijo VITE_. Usa una base independiente para previews si quieres separar sus pedidos. En Vercel el servidor exige almacenamiento remoto: no guarda pedidos en un archivo temporal. El adaptador escribe con comparación atómica para evitar sobreventa; es una implementación pequeña para esta evaluación. El despliegue remoto requiere configuración y comprobación por el dueño del proyecto.

## Verificación y documentación

```sh
npm run test:dom
npm run test:api
npm run build
```

TESTING.md describe las pruebas. ERS.md relaciona las reglas del anexo con lo implementado. El carrito utiliza la clave tienda.carrito.v1. El servidor calcula el total a partir de su catálogo y descuenta existencias solo al confirmar. No hay pasarela de pago ni datos de tarjetas.

