import React, { useState } from "react";
import CampoFormulario from "../molecules/CampoFormulario.jsx";
import Boton from "../atoms/Boton.jsx";
import { regiones } from "../../services/regiones.js";
import { validar, roles, categorias } from "../../services/reglas.js";
const campos = {
  login: [
    ["email", "Correo", "email", 100],
    ["clave", "Contraseña", "password", 10],
  ],
  cuenta: [
    ["run", "RUN sin puntos ni guion", "text", 9],
    ["nombre", "Nombre", "text", 50],
    ["apellidos", "Apellidos", "text", 100],
    ["email", "Correo", "email", 100],
    ["clave", "Contraseña", "password", 10],
    ["fecha", "Fecha de nacimiento (opcional)", "date"],
    ["region", "Región", "select"],
    ["comuna", "Comuna", "select"],
    ["direccion", "Dirección", "text", 300],
  ],
  producto: [
    ["codigo", "Código", "text"],
    ["nombre", "Nombre", "text", 100],
    ["descripcion", "Descripción (opcional)", "textarea", 500],
    ["precio", "Precio en pesos", "decimal"],
    ["stock", "Stock", "numeric"],
    ["critico", "Stock crítico (opcional)", "numeric"],
    ["categoria", "Categoría", "select"],
    ["imagen", "Imagen (URL opcional)", "text"],
  ],
};
export default function FormularioTienda({
  tipo,
  inicial = {},
  administrar = false,
  alEnviar,
  boton = "Guardar",
}) {
  const [d, setD] = useState(() => ({
      ...inicial,
      clave: "",
      rol: inicial.rol || "Cliente",
    })),
    [tocados, setT] = useState({}),
    [todos, setTodos] = useState(false),
    [aviso, setA] = useState(""),
    [ocupado, setO] = useState(false);
  const edicion = !!inicial.id;
  const err = validar(tipo, d, { editar: edicion });
  if (tipo === "cuenta" && d.clave && d.clave !== d.confirmacion)
    err.confirmacion = "Las contraseñas deben coincidir.";
  const opciones = {
    region: Object.keys(regiones),
    comuna: regiones[d.region] || [],
    categoria: categorias,
    rol: roles,
  };
  let lista =
    tipo === "cuenta"
      ? [
          ...campos.cuenta.slice(0, 5),
          ["confirmacion", "Confirmar contraseña", "password", 10],
          ...campos.cuenta.slice(5),
        ]
      : campos[tipo];
  if (tipo === "cuenta" && administrar)
    lista = [...lista, ["rol", "Perfil", "select"]];
  const cambiar = (k, v) => {
    setD((old) => ({
      ...old,
      [k]: v,
      ...(k === "region" ? { comuna: "" } : {}),
    }));
    setT((t) => ({ ...t, [k]: true }));
    setA("");
  };
  async function enviar(e) {
    e.preventDefault();
    setTodos(true);
    if (Object.keys(err).length || ocupado) return;
    setO(true);
    setA("");
    try {
      await alEnviar(d);
    } catch (ex) {
      setA(ex.message);
    } finally {
      setO(false);
    }
  }
  return (
    <form noValidate onSubmit={enviar}>
      {lista.map(([k, label, t, max]) => {
        const id = tipo + "-" + k,
          error = todos || tocados[k] ? err[k] : "";
        const value = d[k] ?? "";
        if (t === "select")
          return (
            <div key={k} className="field">
              <label className="label" htmlFor={id}>
                {label}
              </label>
              <div className="select is-fullwidth">
                <select
                  id={id}
                  value={value}
                  aria-invalid={!!error}
                  aria-describedby={id + "-err"}
                  onBlur={() => setT({ ...tocados, [k]: true })}
                  onChange={(e) => cambiar(k, e.target.value)}
                >
                  <option value="">Selecciona</option>
                  {opciones[k].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
              <p aria-live="polite" id={id + "-err"} className="help is-danger">
                {error}
              </p>
            </div>
          );
        return (
          <CampoFormulario
            key={k}
            id={id}
            etiqueta={
              edicion && k === "clave" ? "Nueva contraseña (opcional)" : label
            }
            errorId={id + "-err"}
            error={error}
            multilinea={t === "textarea"}
            type={["decimal", "numeric", "textarea"].includes(t) ? "text" : t}
            inputMode={["decimal", "numeric"].includes(t) ? t : undefined}
            maxLength={max}
            autoComplete={
              k === "clave"
                ? tipo === "login"
                  ? "current-password"
                  : "new-password"
                : k === "email"
                  ? "email"
                  : undefined
            }
            readOnly={k === "codigo" && !!inicial.codigo}
            value={value}
            onBlur={() => setT({ ...tocados, [k]: true })}
            onChange={(e) => cambiar(k, e.target.value)}
          />
        );
      })}
      {aviso && (
        <p role="alert" className="help is-danger">
          {aviso}
        </p>
      )}
      <Boton type="submit" disabled={ocupado}>
        {ocupado ? "Guardando…" : boton}
      </Boton>
    </form>
  );
}
