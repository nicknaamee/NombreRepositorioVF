# ERS v1 · tienda de la Subdirección del kizazo

**Propósito.** Ampliar la página del equipo con una tienda pequeña, sin cambiar sus textos, recursos ni personalidad. Los mockups del anexo orientan los flujos; el sitio conserva React, Bulma y la estructura Atomic Design. Se mantienen las rutas antiguas y se publican las nuevas bajo la misma carpeta.

| Requisito | Implementación y criterio de aceptación |
|---|---|
| Navegación pública | Inicio ofrece hasta tres productos y acceso al catálogo. El símbolo de tienda, carrito, cuenta, nosotros y blog comparten la navegación; el buzón conserva su diseño original. |
| Catálogo y detalle | Cada producto tiene código estable, nombre, precio, categoría, existencias, descripción e imagen opcionales. El detalle admite añadir al carrito. Un producto agotado no puede añadirse. |
| Carrito | El visitante puede añadir, modificar y quitar líneas. Persisten en localStorage tras recargar. Los precios se muestran en pesos; 0 es válido y se admiten dos decimales. La compra requiere sesión; no se cobran pagos. |
| Órdenes | El servidor valida cantidades, identificadores únicos y stock en el momento de comprar. Recalcula el total, descuenta stock y conserva la orden con los precios y nombres de ese momento. Si falla una línea no se descuenta ninguna. |
| Registro e ingreso | RUN sin puntos ni guion (7–9 caracteres incluido DV), comprobación módulo 11, correo y RUN únicos. Nombres (50) y apellidos (100) con letras, espacios, apóstrofos o guiones. Correo hasta 100, solo duoc.cl, profesor.duoc.cl y gmail.com. Clave 4–10, confirmación en alta/cambio. Fecha opcional válida y no futura. Región y comuna asociadas, dirección requerida de hasta 300 caracteres. El registro público siempre crea Cliente. |
| Contacto | Nombre requerido hasta 100; email requerido con los mismos dominios; asunto requerido hasta 100; comentario requerido hasta 500. Se confirma solo después de guardarse en el buzón administrativo. |
| Productos administrativos | Código único, texto desde tres caracteres; nombre hasta 100; descripción opcional hasta 500; precio no negativo; stock entero no negativo; umbral crítico opcional entero no negativo. Alerta al alcanzar o bajar del umbral, incluso en cero. Categoría obligatoria. Imagen opcional por URL HTTPS; no se suben archivos al servidor. Código inmutable al editar para conservar referencias. |
| Gestión de usuarios | Crear, listar, consultar, editar y eliminar. Solo administración asigna roles. En edición, clave vacía conserva la anterior. No se puede eliminar ni degradar la propia cuenta desde el panel. |
| Roles | Cliente: tienda. Vendedor: consulta de catálogo y órdenes con detalle. Administrador: todos los mantenedores, órdenes y mensajes. El servidor valida permisos por operación incluso si alguien abre admin.html directamente o modifica el cliente. |
| Contenido adicional | Nosotros identifica al equipo. Blog presenta dos artículos con imagen, resumen y detalle, reutilizando los recursos originales. |
| Adaptación | Menú flexible, catálogo en rejilla, formularios de ancho acotado y menú vertical del panel que pasa sobre el contenido en pantallas pequeñas. |

**Persistencia y límites.** Usuarios, hash de contraseña con sal, sesiones, mensajes, órdenes y catálogo persisten en el servidor. Las sesiones duran ocho horas y usan cookies HttpOnly. Los productos eliminados ya comprados siguen visibles en sus órdenes por medio de una copia histórica. El carrito y las sugerencias originales son locales a cada navegador. Los GIF y el video originales siguen dependiendo de sus proveedores.

**Regiones.** No venía adjunto el arreglo complementario de la pauta; se incluyó un catálogo local de 16 regiones y 346 comunas. El cambio de región limpia la comuna anterior y el servidor vuelve a verificar el par.

**Alcance académico.** No procesa dinero, despachos ni correo electrónico. No se inventan commits, reparto de tareas ni actas de colaboración: la evidencia de equipo corresponde al historial real de GitHub. Consulta README.md para ejecutar la demo o configurar un despliegue.

