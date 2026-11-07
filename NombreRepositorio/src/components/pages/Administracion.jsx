import React, { useEffect, useState } from "react";
import PlantillaPagina from "../templates/PlantillaPagina.jsx";
import Boton from "../atoms/Boton.jsx";
import FormularioTienda from "../organisms/FormularioTienda.jsx";
import { tiendaAPI } from "../../services/api.js";
import { useTienda } from "../../services/contexto.jsx";
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
  const [vista, setV] = useState("Productos"),
    [items, setItems] = useState([]),
    [detalle, setD] = useState(null),
    [form, setF] = useState(null),
    [borrar, setB] = useState(null),
    [error, setE] = useState(""),
    [aviso, setA] = useState(""),
    [tick, setTick] = useState(0),
    [carga, setCarga] = useState(false);
  useEffect(() => {
    let vivo = true;
    setItems([]);
    setE("");
    if (!staff || (!admin && ["Usuarios", "Mensajes"].includes(vista))) return;
    setCarga(true);
    tiendaAPI
      .pedir(acciones[vista])
      .then((r) => {
        if (vivo) setItems(r);
      })
      .catch((e) => {
        if (vivo) setE(e.message);
      })
      .finally(() => {
        if (vivo) setCarga(false);
      });
    return () => {
      vivo = false;
    };
  }, [vista, staff, admin, tick]);
  function cambiar(v) {
    if (v !== vista) { setItems([]); setCarga(true); }
    setV(v);
    setD(null);
    setF(null);
    setB(null);
    setA("");
  }
  async function refrescar(m) {
    setA(m);
    setF(null);
    setD(null);
    setB(null);
    setTick((n) => n + 1);
    await recargar();
  }
  async function guardar(d) {
    await tiendaAPI.pedir(vista === "Productos" ? "producto" : "usuario", {
      ...d,
      editar: !!form?.codigo,
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
      setE(e.message);
      setB(null);
    }
  }
  return (
    <PlantillaPagina titulo="Administración">
      <main className="zona-tienda">
        {cargando ? (
          <p>Cargando…</p>
        ) : !staff ? (
          <section className="box">
            <p>Acceso restringido.</p>
            <a href="cuenta.html">Ir a mi cuenta</a>
          </section>
        ) : (
          <div className="panel-admin">
            <aside className="box menu">
              <p className="menu-label">{usuario.rol}</p>
              {(admin ? Object.keys(acciones) : ["Productos", "Órdenes"]).map(
                (v) => (
                  <button
                    key={v}
                    className={"button " + (vista === v ? "is-light" : "")}
                    aria-pressed={vista === v}
                    onClick={() => cambiar(v)}
                  >
                    {v}
                  </button>
                ),
              )}
            </aside>
            <section className="box">
              <h2 className="title is-4">{vista}</h2>
              {aviso && <p role="status">{aviso}</p>}
              {error && (
                <p role="alert">
                  {error}{" "}
                  <button onClick={() => setTick((n) => n + 1)}>
                    Reintentar
                  </button>
                </p>
              )}
              {admin && ["Usuarios", "Productos"].includes(vista) && !form && (
                <Boton
                  onClick={() => {
                    setF({});
                    setD(null);
                    setB(null);
                  }}
                >
                  Crear {vista === "Usuarios" ? "usuario" : "producto"}
                </Boton>
              )}
              {form && admin ? (
                <div className="mt-3">
                  <FormularioTienda
                    key={form.id || form.codigo || "nuevo"}
                    tipo={vista === "Usuarios" ? "cuenta" : "producto"}
                    inicial={form}
                    administrar
                    alEnviar={guardar}
                  />
                  <Boton onClick={() => setF(null)}>Cancelar</Boton>
                </div>
              ) : (
                <>
                  {carga ? (
                    <p>Cargando…</p>
                  ) : !items.length ? (
                    <p>No hay registros.</p>
                  ) : (
                    items.map((x) => (
                      <article key={x.id || x.codigo} className="linea">
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
                          <Boton onClick={() => setD(detalle === x ? null : x)}>
                            Detalle
                          </Boton>
                          {admin &&
                            ["Productos", "Usuarios"].includes(vista) && (
                              <>
                                <Boton
                                  onClick={() => {
                                    setF(x);
                                    setB(null);
                                  }}
                                >
                                  Editar
                                </Boton>
                                <Boton
                                  disabled={
                                    vista === "Usuarios" && x.id === usuario.id
                                  }
                                  onClick={() => setB(x)}
                                >
                                  Eliminar
                                </Boton>
                              </>
                            )}
                        </div>
                        {detalle === x && (
                          <div className="detalle">
                            {vista === "Productos" ? (
                              <p>
                                {x.codigo} · {x.categoria} ·{" "}
                                {x.descripcion || "Sin descripción."}
                              </p>
                            ) : vista === "Usuarios" ? (
                              <p>
                                {x.rol} · {x.run} · {x.email} · {x.direccion} ·{" "}
                                {x.comuna} · {x.region}
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
                            <Boton onClick={eliminar}>Sí, eliminar</Boton>{" "}
                            <Boton onClick={() => setB(null)}>Cancelar</Boton>
                          </div>
                        )}
                      </article>
                    ))
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </main>
    </PlantillaPagina>
  );
}
