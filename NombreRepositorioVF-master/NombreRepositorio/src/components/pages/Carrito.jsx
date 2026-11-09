import React, { useState } from "react";
import PlantillaPagina from "../templates/PlantillaPagina.jsx";
import Boton from "../atoms/Boton.jsx";
import { useTienda } from "../../services/contexto.jsx";
import { ajustar, escribirCarrito, pesos } from "../../services/carrito.js";
import { tiendaAPI } from "../../services/api.js";

export default function Carrito() {
  const { productos, lineas, usuario, cargando, recargar } = useTienda();

  const [mensajeError, setMensajeError] = useState("");
  const [ordenRegistrada, setOrdenRegistrada] = useState(null);
  const [procesandoCompra, setProcesandoCompra] = useState(false);

  const productosEnCarrito = lineas.map((linea) => ({
    ...linea,
    productoDetalle: productos.find((prod) => prod.codigo === linea.codigo),
  }));

  const tieneProblemasStock = productosEnCarrito.some(
    (linea) => !linea.productoDetalle || linea.cantidad > linea.productoDetalle.stock
  );

  const totalCompra = productosEnCarrito.reduce(
    (acumulador, linea) => acumulador + (linea.productoDetalle?.precio || 0) * linea.cantidad,
    0
  );

  async function procesarCompra() {
    if (procesandoCompra) return;
    setProcesandoCompra(true);

    try {
      const nuevaOrden = await tiendaAPI.pedir("comprar", { lineas });
      setOrdenRegistrada(nuevaOrden);
      escribirCarrito([]);
      await recargar();
    } catch (error) {
      setMensajeError(error.message);
      await recargar();
    } finally {
      setProcesandoCompra(false);
    }
  }

  function modificarCantidad(producto, nuevaCantidad) {
    try {
      ajustar(producto, nuevaCantidad);
      setMensajeError("");
    } catch (error) {
      setMensajeError(error.message);
    }
  }

  if (cargando) {
    return (
      <PlantillaPagina titulo="Al carrito, mi rey">
        <div className="container my-5 text-center">
          <p className="fs-5">Cargando tu carrito...</p>
        </div>
      </PlantillaPagina>
    );
  }

  return (
    <PlantillaPagina titulo="Al carrito, mi rey">
      <main className="container my-5">
        <section className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "800px" }}>

          {usuario?.rol === "Vendedor" ? (
            <div className="alert alert-warning text-center">
              Tu perfil de vendedor solo puede consultar productos y órdenes, no comprar.
            </div>
          ) : ordenRegistrada ? (
            <div className="text-center py-4">
              <h2 className="h4 text-success mb-3">¡Compra registrada con éxito, tariamos compare!</h2>
              <p className="fs-5 mb-4">
                Orden #{ordenRegistrada.id} · <strong>{pesos(ordenRegistrada.total)}</strong>
              </p>
              <a href="tienda.html" className="btn btn-outline-primary">Volver a la tienda</a>
            </div>
          ) : productosEnCarrito.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted fs-5 mb-4">Tu carrito está vacío.</p>
              <a href="tienda.html" className="btn btn-primary">Ir a comprar</a>
            </div>
          ) : (
            <>
              <h2 className="h4 mb-4 border-bottom pb-2">Resumen de tu pedido, mi rey</h2>

              <ul className="list-group list-group-flush mb-4">
                {productosEnCarrito.map(({ productoDetalle, codigo, cantidad }) => (
                  <li key={codigo} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center py-3">
                    <div className="mb-2 mb-md-0">
                      <h6 className="mb-1 fw-bold">{productoDetalle?.nombre || codigo}</h6>
                      <span className="text-muted small">
                        {productoDetalle ? pesos(productoDetalle.precio) : "Producto ya no disponible mi chanchito"}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <span className="text-secondary small">Cant: {cantidad}</span>

                      <div className="btn-group btn-group-sm">
                        <Boton
                          aria-label={"Restar " + codigo}
                          className="btn btn-outline-secondary"
                          onClick={() => modificarCantidad(
                            productoDetalle || { codigo, stock: 0 },
                            Math.max(0, cantidad - 1)
                          )}
                        >
                          −
                        </Boton>
                        <Boton
                          aria-label={"Sumar " + codigo}
                          className="btn btn-outline-secondary"
                          disabled={!productoDetalle || cantidad >= productoDetalle.stock}
                          onClick={() => modificarCantidad(productoDetalle, cantidad + 1)}
                        >
                          +
                        </Boton>
                        <Boton
                          className="btn btn-outline-danger"
                          onClick={() => modificarCantidad({ codigo, stock: 0 }, 0)}
                        >
                          Quitar
                        </Boton>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-light p-3 rounded">
                <h5 className="mb-3 mb-md-0 fw-bold">Total: {pesos(totalCompra)}</h5>

                <div className="d-flex flex-column align-items-md-end">
                  {tieneProblemasStock && (
                    <p className="text-danger small mb-2 fw-semibold">
                      * Revisa las cantidades o quita los productos agotados.
                    </p>
                  )}

                  {usuario ? (
                    <Boton
                      className="btn btn-primary px-4"
                      disabled={tieneProblemasStock || procesandoCompra}
                      onClick={procesarCompra}
                    >
                      {procesandoCompra ? "Registrando..." : "Confirmar compra"}
                    </Boton>
                  ) : (
                    <a className="btn btn-primary px-4" href="cuenta.html?volver=carrito">
                      Inicia sesión para comprar
                    </a>
                  )}
                </div>
              </div>
              <p className="text-muted small mt-3 text-center">Pedido de demostración, sin cobro real.</p>
            </>
          )}

          {mensajeError && (
            <div className="alert alert-danger mt-4" role="alert">
              {mensajeError}
            </div>
          )}
        </section>
      </main>
    </PlantillaPagina>
  );
}