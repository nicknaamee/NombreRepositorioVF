import React from "react";
import Selector from "../atoms/Selector.jsx";

export default function CampoSeleccion({ id, etiqueta, error = "", ...props }) {
  const errorId = `${id}-err`;
  return (
    <div className="field">
      <label className="label" htmlFor={id}>
        {etiqueta}
      </label>
      <div className="control">
        <Selector
          id={id}
          name={id}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...props}
        />
      </div>
      <p id={errorId} className="help is-danger" aria-live="polite">
        {error}
      </p>
    </div>
  );
}
