import React, { useState } from "react";
import CampoFormulario from "../molecules/CampoFormulario.jsx";
import CampoSeleccion from "../molecules/CampoSeleccion.jsx";
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
  const [datos, setDatos] = useState(() => ({
      ...inicial,
      clave: "",
      rol: inicial.rol || "Cliente",
    })),
    [tocados, setTocados] = useState({}),
    [todos, setTodos] = useState(false),
    [aviso, setAviso] = useState(""),
    [ocupado, setOcupado] = useState(false);
  const edicion = !!inicial.id;
  const errores = validar(tipo, datos, { editar: edicion });
  if (tipo === "cuenta" && datos.clave && datos.clave !== datos.confirmacion)
    errores.confirmacion = "Las contraseñas deben coincidir.";
  const opciones = {
    region: Object.keys(regiones),
    comuna: regiones[datos.region] || [],
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
    setDatos((old) => ({
      ...old,
      [k]: v,
      ...(k === "region" ? { comuna: "" } : {}),
    }));
    setTocados((t) => ({ ...t, [k]: true }));
    setAviso("");
  };
  async function enviar(e) {
    e.preventDefault();
    setTodos(true);
    if (Object.keys(errores).length || ocupado) return;
    setOcupado(true);
    setAviso("");
    try {
      await alEnviar(datos);
    } catch (ex) {
      setAviso(ex.message);
    } finally {
      setOcupado(false);
    }
  }
  return (
    <form noValidate onSubmit={enviar}>
      {lista.map(([k, label, t, max]) => {
        const id = tipo + "-" + k,
          error = todos || tocados[k] ? errores[k] : "";
        const value = datos[k] ?? "";
        if (t === "select")
          return (
            <CampoSeleccion
              key={k}
              id={id}
              etiqueta={label}
              error={error}
              value={value}
              opciones={opciones[k]}
              onBlur={() =>
                setTocados((previos) => ({ ...previos, [k]: true }))
              }
              onChange={(e) => cambiar(k, e.target.value)}
            />
          );
        return (
          <CampoFormulario
            key={k}
            id={id}
            etiqueta={
              edicion && k === "clave" ? "Nueva contraseña (opcional)" : label
            }
            errorId={id + "-errores"}
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
            onBlur={() => setTocados({ ...tocados, [k]: true })}
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
