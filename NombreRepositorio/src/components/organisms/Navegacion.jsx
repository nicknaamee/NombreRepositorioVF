import React from "react";
import { useTienda } from "../../services/contexto.jsx";
export default function Navegacion() {
  const { usuario, lineas } = useTienda();
  const enlaces = [
    ["Inicio", "index.html"],
    ["Contacto", "contacto.html"],
    ["Otra Pagina", "pag2.html"],
    ["Tienda", "tienda.html"],
    [
      "Carrito (" + lineas.reduce((s, l) => s + l.cantidad, 0) + ")",
      "carrito.html",
    ],
    [usuario ? "Mi cuenta" : "Ingresar", "cuenta.html"],
    ["Nosotros", "info.html"],
    ["Blog", "info.html?blog="],
  ];
  if (usuario && usuario.rol !== "Cliente")
    enlaces.push(["Administración", "admin.html"]);
  return (
    <nav aria-label="Principal" className="box p-0 mt-4 barra-navegacion">
      <div className="contenedor-menu">
        {enlaces
          .filter(
            ([t, h]) => usuario?.rol !== "Vendedor" || h !== "carrito.html",
          )
          .map(([t, h]) => (
            <a href={h} key={h} className="has-text-dark p-3 enlace-menu">
              {t === "Tienda" && <span aria-hidden="true">◻ </span>}
              {t}
            </a>
          ))}
      </div>
    </nav>
  );
}
