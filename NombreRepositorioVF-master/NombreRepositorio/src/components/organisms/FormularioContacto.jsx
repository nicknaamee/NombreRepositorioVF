import React, { useState } from "react";
import CampoFormulario from "../molecules/CampoFormulario.jsx";
import Boton from "../atoms/Boton.jsx";
import Modal from "./Modal.jsx";
import { validar } from "../../services/reglas.js";
import { tiendaAPI } from "../../services/api.js";

const vacio = { nombre: "", email: "", asunto: "", mensaje: "" };

const campos = [
  {
    id: "nombre",
    etiqueta: "Nombre Completo:",
    placeholder: "Ej: Nombre Apellido",
    autoComplete: "name",
    type: "text",
    maxLength: 100,
  },
  {
    id: "email",
    etiqueta: "Correo Electrónico:",
    placeholder: "Ej: correo@ejemplo.com",
    autoComplete: "email",
    type: "email",
    maxLength: 100,
  },
  {
    id: "asunto",
    etiqueta: "Asunto:",
    placeholder: "Ej: Duda sobre mi envío",
    autoComplete: "off",
    type: "text",
    maxLength: 100,
  },
  {
    id: "mensaje",
    etiqueta: "Mensaje:",
    placeholder: "¿En qué te podemos ayudar?", // Cambié el "Loreipsum" genérico por algo más real
    multilinea: true,
    rows: 4,
    maxLength: 500,
  },
];

export default function FormularioContacto() {
  const [datos, setDatos] = useState(vacio);
  const [vistos, setVistos] = useState({});
  const [intentado, setIntentado] = useState(false); 
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [fallo, setFallo] = useState("");

  const errores = validar("contacto", datos);

  async function enviar(e) {
    e.preventDefault();
    setIntentado(true);
    
    if (Object.keys(errores).length || ocupado) return;
    
    setOcupado(true);
    setFallo("");
    
    try {
      await tiendaAPI.pedir("contacto", datos);
      setDatos(vacio);
      setModalAbierto(true);
      setIntentado(false);
      setVistos({});
    } catch (ex) {
      setFallo(ex.message);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <>
      {/* Envolvemos el formulario en una tarjeta de Bootstrap para darle estructura */}
      <form id="formContacto" noValidate onSubmit={enviar} className="card shadow-sm p-4 border-0 mb-5">
        <h3 className="h4 fw-bold mb-4 text-center">Envíanos un mensaje</h3>
        
        {campos.map((c) => (
          <CampoFormulario
            key={c.id}
            {...c}
            errorId={"error" + c.id}
            error={intentado || vistos[c.id] ? errores[c.id] : ""}
            value={datos[c.id]}
            onBlur={() => setVistos({ ...vistos, [c.id]: true })}
            onChange={(e) => {
              setDatos({ ...datos, [c.id]: e.target.value });
              setVistos({ ...vistos, [c.id]: true });
            }}
          />
        ))}
        
        {/* Reemplazamos el párrafo simple por una alerta roja oficial de Bootstrap */}
        {fallo && (
          <div className="alert alert-danger mt-3" role="alert">
            {fallo}
          </div>
        )}
        
        {/* Eliminamos el <div className="field"><div className="control"> de Bulma */}
        <div className="mt-4">
          <Boton
            type="submit"
            disabled={ocupado}
            // w-100 (width 100%) reemplaza a is-fullwidth, y rounded-pill reemplaza a borde-curvo
            className="btn-primary btn-lg w-100 rounded-pill fw-bold"
          >
            {ocupado ? "Enviando..." : "Enviar Mensaje"}
          </Boton>
        </div>
      </form>
      
      <Modal tipo="contacto" abierto={modalAbierto} cerrar={() => setModalAbierto(false)} />
    </>
  );
}