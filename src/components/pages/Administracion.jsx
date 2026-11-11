import React, { useEffect, useState } from "react";
import PlantillaPagina from "../templates/PlantillaPagina.jsx";
import MenuAdministracion from "../molecules/MenuAdministracion.jsx";
import Boton from "../atoms/Boton.jsx";
import FormularioTienda from "../organisms/FormularioTienda.jsx";
import { tiendaAPI } from "../../services/api.js";
import { useTienda } from "../../context/TiendaContext.jsx";
import { pesos } from "../../services/carrito.js";
const acciones = {
  Productos: "catalogo",
  Usuarios: "usuarios",
  Órdenes: "ordenes",
  Mensajes: "mensajes",
};
export default function Administracion() {
  const { usuario, cargando, recargar } = useTienda();
  const admin = usuario?.rol === "Administrador",
    staff = admin || usuario?.rol === "Vendedor";
  const [vista, setVista] = useState("Productos"),
    [items, setItems] = useState([]),
    [detalle, setDetalle] = useState(null),
    [formulario, setFormulario] = useState(null),
    [borrar, setBorrar] = useState(null),
    [error, setError] = useState(""),
    [aviso, setAviso] = useState(""),
    [revision, setRevision] = useState(0),
    [carga, setCarga] = useState(false);
  useEffect(() => {
    let vivo = true;
    setItems([]);
    setError("");
    if (!staff || (!admin && ["Usuarios", "Mensajes"].includes(vista))) return;
    setCarga(true);
    tiendaAPI
      .pedir(acciones[vista])
      .then((r) => {
        if (vivo) setItems(r);
      })
      .catch((e) => {
        if (vivo) setError(e.message);
      })
      .finally(() => {
        if (vivo) setCarga(false);
      });
    return () => {
      vivo = false;
    };
  }, [vista, staff, admin, revision]);
  function cambiar(v) {
    if (v !== vista) {
      setItems([]);
      setCarga(true);
    }
    setVista(v);
    setDetalle(null);
    setFormulario(null);
    setBorrar(null);
    setAviso("");
  }
  async function refrescar(m) {
    setAviso(m);
    setFormulario(null);
    setDetalle(null);
    setBorrar(null);
    setRevision((n) => n + 1);
    await recargar();
  }
  async function guardar(d) {
    await tiendaAPI.pedir(vista === "Productos" ? "producto" : "usuario", {
      ...d,
      editar: !!formulario?.codigo,
    });
    await refrescar("Cambios guardados.");
  }
  async function eliminar() {
    try {
      await tiendaAPI.pedir(
        vista === "Productos" ? "borrarProducto" : "borrarUsuario",
        borrar,
      );
      await refrescar("Eliminado.");
    } catch (e) {
      setError(e.message);
      setBorrar(null);
    }
  }
  return (
    <PlantillaPagina titulo="Administración">
      <main className="container is-max-desktop px-4 my-5">
        {cargando ? (
          <p>Cargando…</p>
        ) : !staff ? (
          <section className="box">
            <p>Acceso restringido.</p>
            <a href="cuenta.html">Ir a mi cuenta</a>
          </section>
        ) : (
          <div className="columns is-align-items-flex-start">
            <div className="column is-one-quarter">
              <MenuAdministracion
                rol={usuario.rol}
                vista={vista}
                alCambiar={cambiar}
              />
            </div>
            <div className="column">
              <section className="box">
                <h2 className="title is-4">{vista}</h2>
                {aviso && <p role="status">{aviso}</p>}
                {error && (
                  <p role="alert">
                    {error}{" "}
                    <button onClick={() => setRevision((n) => n + 1)}>
                      Reintentar
                    </button>
                  </p>
                )}
                {admin &&
                  ["Usuarios", "Productos"].includes(vista) &&
                  !formulario && (
                    <Boton
                      onClick={() => {
                        setFormulario({});
                        setDetalle(null);
                        setBorrar(null);
                      }}
                    >
                      Crear {vista === "Usuarios" ? "usuario" : "producto"}
                    </Boton>
                  )}
                {formulario && admin ? (
                  <div className="mt-3">
                    <FormularioTienda
                      key={formulario.id || formulario.codigo || "nuevo"}
                      tipo={vista === "Usuarios" ? "cuenta" : "producto"}
                      inicial={formulario}
                      administrar
                      alEnviar={guardar}
                    />
                    <Boton onClick={() => setFormulario(null)}>Cancelar</Boton>
                  </div>
                ) : (
                  <>
                    {carga ? (
                      <p>Cargando…</p>
                    ) : !items.length ? (
                      <p>No hay registros.</p>
                    ) : (
                      items.map((x) => (
                        <article
                          key={x.id || x.codigo}
                          className="py-3 registro"
                        >
                          <strong>
                            {vista === "Productos"
                              ? x.nombre
                              : vista === "Usuarios"
                                ? x.nombre + " " + x.apellidos
                                : vista === "Órdenes"
                                  ? "Orden " + x.id
                                  : x.asunto}
                          </strong>
                          {vista === "Productos" && (
                            <p>
                              {pesos(x.precio)} · Stock: {x.stock}{" "}
                              {x.critico != null && x.stock <= x.critico && (
                                <span className="tag is-warning">
                                  Stock crítico
                                </span>
                              )}
                            </p>
                          )}
                          <div className="buttons">
                            <Boton
                              onClick={() =>
                                setDetalle(detalle === x ? null : x)
                              }
                            >
                              Detalle
                            </Boton>
                            {admin &&
                              ["Productos", "Usuarios"].includes(vista) && (
                                <>
                                  <Boton
                                    onClick={() => {
                                      setFormulario(x);
                                      setBorrar(null);
                                    }}
                                  >
                                    Editar
                                  </Boton>
                                  <Boton
                                    disabled={
                                      vista === "Usuarios" &&
                                      x.id === usuario.id
                                    }
                                    onClick={() => setBorrar(x)}
                                  >
                                    Eliminar
                                  </Boton>
                                </>
                              )}
                          </div>
                          {detalle === x && (
                            <div className="notification is-light p-3">
                              {vista === "Productos" ? (
                                <p>
                                  {x.codigo} · {x.categoria} ·{" "}
                                  {x.descripcion || "Sin descripción."}
                                </p>
                              ) : vista === "Usuarios" ? (
                                <p>
                                  {x.rol} · {x.run} · {x.email} · {x.direccion}{" "}
                                  · {x.comuna} · {x.region}
                                </p>
                              ) : vista === "Mensajes" ? (
                                <p>
                                  {x.nombre} · {x.email}
                                  <br />
                                  {x.mensaje}
                                </p>
                              ) : (
                                <>
                                  <p>
                                    {x.cliente} ·{" "}
                                    {new Date(x.fecha).toLocaleString("es-CL")}
                                  </p>
                                  <ul>
                                    {x.lineas.map((l) => (
                                      <li key={l.codigo}>
                                        {l.cantidad} × {l.nombre} ·{" "}
                                        {pesos(l.precio)}
                                      </li>
                                    ))}
                                  </ul>
                                  <strong>Total: {pesos(x.total)}</strong>
                                </>
                              )}
                            </div>
                          )}
                          {borrar === x && (
                            <div>
                              <p>¿Eliminar {x.nombre}?</p>
                              <Boton onClick={eliminar}>
                                Sí, eliminar
                              </Boton>{" "}
                              <Boton onClick={() => setBorrar(null)}>
                                Cancelar
                              </Boton>
                            </div>
                          )}
                        </article>
                      ))
                    )}
                  </>
                )}
              </section>
            </div>
          </div>
        )}
      </main>
    </PlantillaPagina>
  );
}
