import React, { useState } from "react";
import PlantillaPagina from "../templates/PlantillaPagina.jsx";
import FormularioTienda from "../organisms/FormularioTienda.jsx";
import Boton from "../atoms/Boton.jsx";
import { tiendaAPI } from "../../services/api.js";
import { useTienda } from "../../context/TiendaContext.jsx";
export default function Cuenta() {
  const { usuario, cargando, recargar } = useTienda(),
    [error, setError] = useState("");
  const q = new URLSearchParams(location.search),
    registro = q.has("registro"),
    volver = q.get("volver") === "carrito" ? "carrito.html" : "cuenta.html";
  async function enviar(d) {
    await tiendaAPI.pedir(registro ? "registro" : "login", d);
    location.assign(volver);
  }
  return (
    <PlantillaPagina
      titulo={usuario ? "Mi cuenta" : registro ? "Registro" : "Iniciar sesión"}
    >
      <main className="container is-max-tablet px-4 my-5 zona-estrecha">
        <section className="box">
          <p className="marca">◻ Subdirección del kizazo</p>
          {cargando ? (
            <p>Cargando…</p>
          ) : usuario ? (
            <>
              <p>
                {usuario.nombre} · {usuario.rol}
              </p>
              {usuario.rol !== "Cliente" && (
                <p>
                  <a href="admin.html">Abrir administración</a>
                </p>
              )}
              <Boton
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
              {error && <p role="alert">{error}</p>}
            </>
          ) : (
            <>
              <FormularioTienda
                tipo={registro ? "cuenta" : "login"}
                alEnviar={enviar}
                boton={registro ? "Crear cuenta" : "Ingresar"}
              />
              <p className="mt-4">
                <a
                  href={
                    "cuenta.html?" +
                    (registro ? "" : "registro=1&") +
                    (q.get("volver") === "carrito" ? "volver=carrito" : "")
                  }
                >
                  {registro ? "Ya tengo cuenta" : "Crear una cuenta"}
                </a>
              </p>
            </>
          )}
        </section>
      </main>
    </PlantillaPagina>
  );
}
