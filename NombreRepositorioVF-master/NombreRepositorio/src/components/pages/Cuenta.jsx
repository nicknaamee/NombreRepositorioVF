import React, { useState } from "react";
import PlantillaPagina from "../templates/PlantillaPagina.jsx";
import FormularioTienda from "../organisms/FormularioTienda.jsx";
import Boton from "../atoms/Boton.jsx";
import { tiendaAPI } from "../../services/api.js";
import { useTienda } from "../../services/contexto.jsx";

export default function Cuenta() {
  const { usuario, cargando, recargar } = useTienda();
  
  // Clean Code: Renombramos "setE" a "setError" para mayor legibilidad
  const [error, setError] = useState("");
  
  const q = new URLSearchParams(location.search);
  const registro = q.has("registro");
  const volver = q.get("volver") === "carrito" ? "carrito.html" : "cuenta.html";

  async function enviar(d) {
    await tiendaAPI.pedir(registro ? "registro" : "login", d);
    location.assign(volver);
  }

  return (
    <PlantillaPagina
      titulo={usuario ? "Mi cuenta" : registro ? "Registro" : "Iniciar sesión"}
    >
      {/* Centramos la tarjeta en la pantalla y limitamos su ancho para que no se estire */}
      <main className="container my-5 d-flex justify-content-center">
        <section className="card shadow-sm p-4 border-0 w-100" style={{ maxWidth: "450px" }}>
          
          <h2 className="h5 fw-bold mb-4 text-center">
            <span aria-hidden="true" className="text-primary me-2">◻</span>
            Subdirección del kizazo
          </h2>
          
          {cargando ? (
            // Reemplazamos el texto "Cargando..." por el Spinner nativo de Bootstrap
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando…</span>
              </div>
            </div>
          ) : usuario ? (
            <div className="text-center">
              <p className="fs-5 fw-medium mb-1">{usuario.nombre}</p>
              
              {/* Le damos estilo de etiqueta (Badge) al rol del usuario */}
              <span className="badge bg-secondary mb-4">{usuario.rol}</span>
              
              {usuario.rol !== "Cliente" && (
                <div className="mb-3">
                  <a href="admin.html" className="btn btn-outline-primary w-100 rounded-pill fw-bold">
                    Abrir administración
                  </a>
                </div>
              )}
              
              <Boton
                className="btn-danger w-100 rounded-pill fw-bold mt-2"
                onClick={async () => {
                  try {
                    await tiendaAPI.pedir("salir");
                    await recargar();
                  } catch (e) {
                    setError(e.message);
                  }
                }}
              >
                Cerrar sesión
              </Boton>
              
              {/* Manejo de errores con la alerta roja de Bootstrap */}
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <>
              <FormularioTienda
                tipo={registro ? "cuenta" : "login"}
                alEnviar={enviar}
                boton={registro ? "Crear cuenta" : "Ingresar"}
              />
              <p className="mt-4 text-center mb-0">
                <a
                  className="text-decoration-none fw-medium"
                  href={
                    "cuenta.html?" +
                    (registro ? "" : "registro=1&") +
                    (q.get("volver") === "carrito" ? "volver=carrito" : "")
                  }
                >
                  {registro ? "¿Ya tienes cuenta? Ingresa aquí" : "¿No tienes cuenta? Crea una aquí"}
                </a>
              </p>
            </>
          )}
        </section>
      </main>
    </PlantillaPagina>
  );
}