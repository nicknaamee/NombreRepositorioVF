import React from "react";

export default function Boton({ children, className = "", ...props }) {
  return (
    // Cambiao "button" de Bulma por "btn" de Bootstrap
    <button className={`btn ${className}`} {...props}>
      {children}
    </button>
  );
}