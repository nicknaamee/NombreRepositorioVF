import React from "react";

export default function Encabezado({ titulo = "Título" }) {
  return (
    <header className="bg-light py-4 mb-4 border-bottom shadow-sm">
      <div className="container text-center">
        {/* Usamos display-5 para un texto grande y elegante, y fw-bold para negrita */}
        <h1 className="display-5 fw-bold text-dark mb-0">
          {titulo}
        </h1>
      </div>
    </header>
  );
}