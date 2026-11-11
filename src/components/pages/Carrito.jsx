import React, { useState } from "react";
import PlantillaPagina from "../templates/PlantillaPagina.jsx";
import Boton from "../atoms/Boton.jsx";
import { useTienda } from "../../context/TiendaContext.jsx";
import { ajustar, escribirCarrito, pesos } from "../../services/carrito.js";
import { tiendaAPI } from "../../services/api.js";
export default function Carrito() {
  const { productos, lineas, usuario, cargando, recargar } = useTienda(),
    [aviso, setAviso] = useState(""),
    [orden, setOrden] = useState(null),
    [ocupado, setOcupado] = useState(false);
  const filas = lineas.map((l) => ({
    ...l,
    p: productos.find((x) => x.codigo === l.codigo),
  }));
  const invalido = filas.some((l) => !l.p || l.cantidad > l.p.stock);
  const total =
    filas.reduce(
      (acc, l) => acc + Math.round((l.p?.precio || 0) * 100) * l.cantidad,
      0,
    ) / 100;
  async function comprar() {
    if (ocupado) return;
    setOcupado(true);
    try {
      const o = await tiendaAPI.pedir("comprar", { lineas });
      setOrden(o);
      escribirCarrito([]);
      await recargar();
    } catch (e) {
      setAviso(e.message);
      await recargar();
    } finally {
      setOcupado(false);
    }
  }
  function cambiar(p, c) {
    try {
      ajustar(p, c);
      setAviso("");
    } catch (e) {
      setAviso(e.message);
    }
  }
  return (
    <PlantillaPagina titulo="Carrito">
      <main className="container is-max-tablet px-4 my-5 zona-estrecha">
        <section className="box">
          {usuario?.rol === "Vendedor" ? (
            <p>Tu perfil solo consulta productos y órdenes.</p>
          ) : orden ? (
            <>
              <h2 className="title is-5">Compra registrada</h2>
              <p>
                Orden {orden.id} · {pesos(orden.total)}
              </p>
            </>
          ) : cargando ? (
            <p>Cargando…</p>
          ) : !filas.length ? (
            <p>El carrito está vacío.</p>
          ) : (
            <>
              {filas.map(({ p, codigo, cantidad }) => (
                <div key={codigo} className="py-3 registro">
                  <p>
                    <strong>{p?.nombre || codigo}</strong> ·{" "}
                    {p ? pesos(p.precio) : "Ya no disponible"}
                  </p>
                  <p>Cantidad: {cantidad}</p>
                  <div className="buttons">
                    <Boton
                      aria-label={"Restar " + codigo}
                      onClick={() =>
                        cambiar(
                          p || { codigo, stock: 0 },
                          Math.min(cantidad - 1, p?.stock || 0),
                        )
                      }
                    >
                      −
                    </Boton>
                    <Boton
                      aria-label={"Sumar " + codigo}
                      disabled={!p || cantidad >= p.stock}
                      onClick={() => cambiar(p, cantidad + 1)}
                    >
                      +
                    </Boton>
                    <Boton onClick={() => cambiar({ codigo, stock: 0 }, 0)}>
                      Quitar
                    </Boton>
                  </div>
                </div>
              ))}
              <p className="title is-5">Total: {pesos(total)}</p>
              {invalido && (
                <p className="help is-danger">
                  Revisa las cantidades o quita los productos agotados.
                </p>
              )}
              {usuario ? (
                <Boton disabled={invalido || ocupado} onClick={comprar}>
                  {ocupado ? "Registrando…" : "Confirmar compra"}
                </Boton>
              ) : (
                <a className="button" href="cuenta.html?volver=carrito">
                  Inicia sesión para comprar
                </a>
              )}
              <p className="help">Pedido de demostración, sin cobro.</p>
            </>
          )}
          {aviso && <p role="alert">{aviso}</p>}
          <p className="mt-4">
            <a href="tienda.html">Volver a la tienda</a>
          </p>
        </section>
      </main>
    </PlantillaPagina>
  );
}
