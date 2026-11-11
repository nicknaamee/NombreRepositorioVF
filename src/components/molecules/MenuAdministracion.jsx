import React from "react";
import Boton from "../atoms/Boton.jsx";

export default function MenuAdministracion({ rol, vista, alCambiar }) {
  const vistas =
    rol === "Administrador"
      ? ["Productos", "Usuarios", "Órdenes", "Mensajes"]
      : rol === "Vendedor"
        ? ["Productos", "Órdenes"]
        : [];
  return (
    <aside className="box menu">
      <p className="menu-label">{rol}</p>
      <div className="buttons">
        {vistas.map((nombre) => (
          <Boton
            key={nombre}
            className={`is-fullwidth ${vista === nombre ? "is-light" : ""}`}
            aria-pressed={vista === nombre}
            onClick={() => alCambiar(nombre)}
          >
            {nombre}
          </Boton>
        ))}
      </div>
    </aside>
  );
}
