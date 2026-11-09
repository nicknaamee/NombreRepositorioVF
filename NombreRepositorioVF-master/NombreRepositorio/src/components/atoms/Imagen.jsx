import React from "react";

export default function Imagen({ className = "", alt = "Imagen del producto", ...props }) {
  // img-fluid asegura que la imagen nunca se desborde de su contenedor en celulares
  const clasesFinales = `img-fluid ${className}`.trim();

  return (
    <img 
      className={clasesFinales} 
      alt={alt} 
      {...props} 
    />
  );
}