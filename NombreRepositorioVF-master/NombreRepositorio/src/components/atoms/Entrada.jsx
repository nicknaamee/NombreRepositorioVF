import React from "react";

export default function Entrada({ multilinea = false, className = "", ...props }) {
  // Unimos la clase obligatoria de Bootstrap con cualquier otra que envíe el componente padre
  const clasesFinales = `form-control ${className}`.trim();

  return multilinea ? (
    <textarea className={clasesFinales} {...props} />
  ) : (
    <input className={clasesFinales} {...props} />
  );
}