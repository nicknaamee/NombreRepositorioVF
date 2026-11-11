import React, { createContext, useContext, useEffect, useState } from "react";
import { tiendaAPI } from "../services/api.js";
import { leerCarrito } from "../services/carrito.js";
export const TiendaContext = createContext({
  productos: [],
  usuario: null,
  lineas: [],
  cargando: false,
  error: "",
  recargar: async () => {},
});
export const useTienda = () => useContext(TiendaContext);
export function ProveedorTienda({ children }) {
  const [datos, setDatos] = useState({ productos: [], usuario: null }),
    [cargando, setCargando] = useState(true),
    [error, setError] = useState(""),
    [lineas, setLineas] = useState(leerCarrito);
  async function recargar() {
    try {
      const [productos, usuario] = await Promise.all([
        tiendaAPI.pedir("catalogo"),
        tiendaAPI.pedir("sesion"),
      ]);
      setDatos({ productos, usuario });
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }
  useEffect(() => {
    recargar();
    const cambio = () => setLineas(leerCarrito());
    window.addEventListener("carrito", cambio);
    window.addEventListener("storage", cambio);
    return () => {
      window.removeEventListener("carrito", cambio);
      window.removeEventListener("storage", cambio);
    };
  }, []);
  return (
    <TiendaContext.Provider
      value={{ ...datos, error, cargando, lineas, recargar }}
    >
      {error && (
        <p className="notification is-warning" role="alert">
          {error} <button onClick={recargar}>Reintentar</button>
        </p>
      )}
      {children}
    </TiendaContext.Provider>
  );
}
