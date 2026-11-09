import React from "react";
import { useTienda } from "../../services/contexto.jsx";

export default function Navegacion() {
  const { usuario, lineas } = useTienda();

  // Calculamos el total de items en el carrito
  const cantidadCarrito = lineas.reduce((s, l) => s + l.cantidad, 0);

  // Transformamos el arreglo de arreglos en un arreglo de objetos 
  const enlaces = [
    { texto: "Inicio", href: "index.html" },
    { texto: "Contacto", href: "contacto.html" },
    { texto: "Otra Pagina", href: "pag2.html" },
    { texto: "Tienda", href: "tienda.html", icono: "🏪 " },
    { texto: "Nosotros", href: "info.html" },
    { texto: "Blog", href: "info.html?blog=" },
    { texto: usuario ? "Mi cuenta" : "Ingresar", href: "cuenta.html" },
  ];

  // Lógica dinámica: Insertar el carrito si no es vendedor
  if (usuario?.rol !== "Vendedor") {
    enlaces.splice(4, 0, {
      texto: "Carrito",
      href: "carrito.html",
      badge: cantidadCarrito,
    });
  }

  // Lógica dinámica: Insertar administración al final si aplica
  if (usuario && usuario.rol !== "Cliente") {
    enlaces.push({ texto: "Administración", href: "admin.html" });
  }

  return (
    // nav y shadow-sm reemplazan al "box" de Bulma
    <nav aria-label="Principal" className="bg-white shadow-sm rounded mb-4 mt-4 p-2">
      
      {/* nav-pills crea botones elegantes; flex-column a flex-md-row lo hace responsivo */}
      <ul className="nav nav-pills flex-column flex-md-row justify-content-center text-center m-0">
        
        {enlaces.map((enlace) => (
          <li className="nav-item mx-1 my-1" key={enlace.href}>
            <a
              href={enlace.href}
              className="nav-link text-dark fw-medium d-flex align-items-center justify-content-center"
            >
              {enlace.icono && <span aria-hidden="true" className="me-2">{enlace.icono}</span>}
              
              {enlace.texto}
              
              {/* Usamos el componente "Badge" oficial de Bootstrap para el contador del carrito */}
              {enlace.badge !== undefined && (
                <span className="badge bg-primary rounded-pill ms-2">
                  {enlace.badge}
                </span>
              )}
            </a>
          </li>
        ))}
        
      </ul>
    </nav>
  );
}