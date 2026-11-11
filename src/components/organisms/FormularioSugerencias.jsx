import React from "react";
import { useState } from "react";
import CampoFormulario from "../molecules/CampoFormulario.jsx";
import Boton from "../atoms/Boton.jsx";
import Modal from "./Modal.jsx";
import {
  guardarSugerencia,
  tienePalabraMala,
} from "../../services/sugerencias.js";
export default function FormularioSugerencias() {
  const [texto, setTexto] = useState(""),
    [error, setError] = useState(false),
    [modal, setModal] = useState("");
  function enviar(e) {
    e.preventDefault();
    if (!texto.trim() || texto.length > 500) {
      setError(true);
      return;
    }
    setError(false);
    if (tienePalabraMala(texto)) {
      setModal("advertencia");
      return;
    }
    guardarSugerencia(texto);
    setTexto("");
    setModal("sugerencia");
  }
  return (
    <section className="box mt-4 seccion-centrada">
      <h2 className="subBuzon">Buzón de sugerencias</h2>
      <form id="miFormulario" onSubmit={enviar}>
        <CampoFormulario
          id="campoTexto"
          etiqueta="Aquí escribe tu sugerencia:"
          type="text"
          autoComplete="off"
          maxLength={500}
          aria-invalid={error}
          aria-describedby="mensajeError"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setError(!e.target.value.trim() || e.target.value.length > 500);
          }}
        />
        <p
          id="mensajeError"
          className={`help is-danger ${error ? "" : "is-hidden"}`}
        >
          Error: introducir texto válido
        </p>
        <div className="field mt-4">
          <Boton className="borde-curvo" type="submit">
            Enviar
          </Boton>
        </div>
      </form>
      <Modal
        tipo="sugerencia"
        abierto={modal === "sugerencia"}
        cerrar={() => setModal("")}
      />
      <Modal
        tipo="advertencia"
        abierto={modal === "advertencia"}
        cerrar={() => setModal("")}
      />
    </section>
  );
}
