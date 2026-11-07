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
    <div className="field">
      <label className="label has-text-weight-normal" htmlFor={id}>
        {etiqueta}
      </label>
      <div className="control">
        <Entrada
          id={id}
          name={id}
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          {...props}
        />
      </div>
      {errorId && (
        <p className="help is-danger" aria-live="polite" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
