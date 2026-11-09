import React from "react";

export default function TarjetaSugerencia({ texto }) {
  return (
    <div className="alert alert-danger d-flex align-items-center mt-3 shadow-sm py-2" role="alert">
      <span className="fs-4 me-3" aria-hidden="true">🗑️</span>
      <p className="mb-0 fw-medium text-dark">{texto}</p>
    </div>
  );
}