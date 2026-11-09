import React from "react";
import Imagen from "../atoms/Imagen.jsx";

export default function Presentacion() { 
  return (
    // Reemplazamos el "box" de Bulma por un "card" sin bordes y con sombra suave
    // mx-auto centra la sección si la pantalla es muy ancha
    <section className="card shadow-sm p-4 mt-4 mx-auto border-0 bg-white text-center" style={{ maxWidth: "800px" }}>
      
      {/* Añadimos la clase "lead" para que el texto tenga más presencia sin ser un título */}
      <p className="lead fw-medium text-dark mb-0">
        Esta es una página web
      </p>
      
      {/* Centramos la figura y eliminamos el is-inline-block obsoleto */}
      <figure className="mt-4 mb-0">
        <Imagen 
          src="https://i.pinimg.com/originals/b0/7c/cc/b07cccf8a15ecf462d917fc0636e1895.gif" 
          alt="kizazo kunfugato" 
          // Pasamos el borde redondeado y una pequeña sombra al átomo Imagen
          className="rounded-4 shadow" 
        />
      </figure>
      
    </section>
  ); 
}