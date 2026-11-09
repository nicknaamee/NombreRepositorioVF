import React from "react";
import Entrada from "../atoms/Entrada.jsx";

export default function CampoFormulario({
  id,
  etiqueta,
  error = "",
  errorId,
  ...props
}) {
  return (
    <div className="mb-3 text-start">
      <label className="form-label fw-semibold" htmlFor={id}>
        {etiqueta}
      </label>
      <Entrada
        id={id}
        name={id}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        className={error ? "form-control is-invalid" : "form-control"}
        {...props}
      />
      {errorId && error && (
        <div className="text-danger small mt-1 fw-bold" aria-live="polite" id={errorId}>
          {error}
        </div>
      )}
    </div>
  );
}