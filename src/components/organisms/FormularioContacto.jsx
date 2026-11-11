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
    placeholder: "Ej: Consulta sobre el curso",
    autoComplete: "off",
    type: "text",
    maxLength: 100,
  },
  {
    id: "mensaje",
    etiqueta: "Mensaje:",
    placeholder: "LoreipsumLoreipsumLoreipsumLoreipsum",
    multilinea: true,
    rows: 4,
    maxLength: 500,
  },
];
export default function FormularioContacto() {
  const [datos, setDatos] = useState(vacio),
    [vistos, setV] = useState({}),
    [todos, setT] = useState(false),
    [abierto, setA] = useState(false),
    [ocupado, setO] = useState(false),
    [fallo, setF] = useState("");
  const errores = validar("contacto", datos);
  async function enviar(e) {
    e.preventDefault();
    setT(true);
    if (Object.keys(errores).length || ocupado) return;
    setO(true);
    setF("");
    try {
      await tiendaAPI.pedir("contacto", datos);
      setDatos(vacio);
      setA(true);
      setT(false);
      setV({});
    } catch (ex) {
      setF(ex.message);
    } finally {
      setO(false);
    }
  }
  return (
    <>
      <form id="formContacto" noValidate onSubmit={enviar}>
        {campos.map((c) => (
          <CampoFormulario
            key={c.id}
            {...c}
            errorId={"error" + c.id}
            error={todos || vistos[c.id] ? errores[c.id] : ""}
            value={datos[c.id]}
            onBlur={() => setV({ ...vistos, [c.id]: true })}
            onChange={(e) => {
              setDatos({ ...datos, [c.id]: e.target.value });
              setV({ ...vistos, [c.id]: true });
            }}
          />
        ))}
        {fallo && <p role="alert">{fallo}</p>}
        <div className="field">
          <div className="control">
            <Boton
              type="submit"
              disabled={ocupado}
              className="borde-curvo is-fullwidth"
            >
              Enviar Mensaje
            </Boton>
          </div>
        </div>
      </form>
      <Modal tipo="contacto" abierto={abierto} cerrar={() => setA(false)} />
    </>
  );
}
