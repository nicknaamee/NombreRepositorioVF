import React, { useState } from "react";
import CampoFormulario from "../molecules/CampoFormulario.jsx";
import Boton from "../atoms/Boton.jsx";
import Modal from "./Modal.jsx";
import {
  guardarSugerencia,
  tienePalabraMala,
} from "../../services/sugerencias.js";

export default function FormularioSugerencias() {
  // Separamos los estados para cumplir con los estándares de Clean Code
  const [texto, setTexto] = useState("");
  const [error, setError] = useState(false);
  const [modal, setModal] = useState("");

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
    // Reemplazamos "box" por "card" de Bootstrap y centramos con "mx-auto"
    <section className="card shadow-sm p-4 mt-4 mx-auto border-0 bg-light" style={{ maxWidth: "600px" }}>
      <h2 className="h4 fw-bold mb-4 text-center">Buzón de sugerencias</h2>
      
      <form id="miFormulario" onSubmit={enviar}>
        <CampoFormulario
          id="campoTexto"
          etiqueta="Aquí escribe tu sugerencia:"
          type="text"
          autoComplete="off"
          maxLength={500}
          // Aprovechamos que nuestro CampoFormulario ya maneja errores con Bootstrap
          error={error ? "Error: Por favor, introduce un texto válido." : ""}
          errorId="mensajeError"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setError(!e.target.value.trim() || e.target.value.length > 500);
          }}
        />
        
        {/* Eliminamos el <div className="field"> de Bulma */}
        <div className="text-center mt-4">
          <Boton className="btn-primary rounded-pill px-5 fw-bold" type="submit">
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