import React, { useEffect, useState } from "react";
import PlantillaPagina from "../templates/PlantillaPagina.jsx";
import Boton from "../atoms/Boton.jsx";
import FormularioTienda from "../organisms/FormularioTienda.jsx";
import { tiendaAPI } from "../../services/api.js";
import { useTienda } from "../../services/contexto.jsx";
import { pesos } from "../../services/carrito.js";

// Mapeo de las vistas a los endpoints de la API
const rutasApi = {
  Productos: "catalogo",
  Usuarios: "usuarios",
  Órdenes: "ordenes",
  Mensajes: "mensajes",
};

export default function Administracion() {
  const { usuario, cargando, recargar } = useTienda();

  // 1. VALIDACIÓN DE ROLES
  const esAdministrador = usuario?.rol === "Administrador";
  const esStaff = esAdministrador || usuario?.rol === "Vendedor";

  // 2. ESTADOS LOCALES 
  const [vistaActiva, setVistaActiva] = useState("Productos");
  const [listaDatos, setListaDatos] = useState([]);
  const [elementoDetalle, setElementoDetalle] = useState(null);
  const [formularioActivo, setFormularioActivo] = useState(null);
  const [elementoABorrar, setElementoABorrar] = useState(null);

  const [mensajeError, setMensajeError] = useState("");
  const [mensajeAviso, setMensajeAviso] = useState("");
  const [contadorRefresco, setContadorRefresco] = useState(0); // Para forzar recargas
  const [cargandoDatos, setCargandoDatos] = useState(false);

  // 3. EFECTO PARA CARGAR DATOS SEGÚN LA VISTA SELECCIONADA
  useEffect(() => {
    let componenteMontado = true; // Patrón para evitar fugas de memoria si el usuario cambia de página rápido

    setListaDatos([]);
    setMensajeError("");

    // Bloqueo de seguridad: Si no es staff, o si es vendedor intentando ver Usuarios/Mensajes, se detiene.
    if (!esStaff || (!esAdministrador && ["Usuarios", "Mensajes"].includes(vistaActiva))) return;

    setCargandoDatos(true);

    tiendaAPI
      .pedir(rutasApi[vistaActiva])
      .then((respuesta) => {
        if (componenteMontado) setListaDatos(respuesta);
      })
      .catch((error) => {
        if (componenteMontado) setMensajeError(error.message);
      })
      .finally(() => {
        if (componenteMontado) setCargandoDatos(false);
      });

    // Función de limpieza del useEffect
    return () => {
      componenteMontado = false;
    };
  }, [vistaActiva, esStaff, esAdministrador, contadorRefresco]);

  // 4 FUNCIONES DE INTERACCIÓN Y NAVEGACIÓN
  function cambiarVista(nuevaVista) {
    if (nuevaVista !== vistaActiva) {
      setListaDatos([]);
      setCargandoDatos(true);
    }
    setVistaActiva(nuevaVista);
    setElementoDetalle(null);
    setFormularioActivo(null);
    setElementoABorrar(null);
    setMensajeAviso("");
  }

  async function refrescarPantalla(mensaje) {
    setMensajeAviso(mensaje);
    setFormularioActivo(null);
    setElementoDetalle(null);
    setElementoABorrar(null);
    setContadorRefresco((num) => num + 1);
    await recargar();
  }

  async function guardarRegistro(datos) {
    await tiendaAPI.pedir(vistaActiva === "Productos" ? "producto" : "usuario", {
      ...datos,
      editar: !!formularioActivo?.codigo,
    });
    await refrescarPantalla("Cambios guardados exitosamente.");
  }

  async function eliminarRegistro() {
    try {
      await tiendaAPI.pedir(
        vistaActiva === "Productos" ? "borrarProducto" : "borrarUsuario",
        elementoABorrar
      );
      await refrescarPantalla("Registro eliminado.");
    } catch (error) {
      setMensajeError(error.message);
      setElementoABorrar(null);
    }
  }

  // 5. RENDERIZADOS CONDICIONALES DE SEGURIDAD (Early Returns)
  if (cargando) {
    return (
      <PlantillaPagina titulo="Administración">
        <div className="container my-5 text-center">
          <p className="fs-5">Cargando sistema...</p>
        </div>
      </PlantillaPagina>
    );
  }

  if (!esStaff) {
    return (
      <PlantillaPagina titulo="Administración">
        <div className="container my-5">
          <div className="alert alert-danger text-center shadow-sm p-5">
            <h2 className="h4">Acceso restringido</h2>
            <p>No tienes los permisos necesarios para ver esta página.</p>
            <a href="cuenta.html" className="btn btn-primary mt-3">Ir a mi cuenta</a>
          </div>
        </div>
      </PlantillaPagina>
    );
  }

  // 6. RENDERIZADO PRINCIPAL (Layout con Bootstrap)
  const opcionesMenu = esAdministrador ? Object.keys(rutasApi) : ["Productos", "Órdenes"];

  return (
    <PlantillaPagina titulo="Panel de Administración">
      <main className="container my-5">
        <div className="row">

          {/* BARRA LATERAL (Menú de navegación) */}
          <aside className="col-md-3 mb-4 mb-md-0">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white fw-bold text-center">
                Perfil: {usuario.rol}
              </div>
              <div className="list-group list-group-flush">
                {opcionesMenu.map((opcion) => (
                  <button
                    key={opcion}
                    className={`list-group-item list-group-item-action ${vistaActiva === opcion ? "active fw-bold" : ""}`}
                    onClick={() => cambiarVista(opcion)}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* CONTENIDO PRINCIPAL */}
          <section className="col-md-9">
            <div className="card shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h2 className="h4 mb-0">{vistaActiva}</h2>

                {/* Botón de creación (Solo para Admin en ciertas vistas) */}
                {esAdministrador && ["Usuarios", "Productos"].includes(vistaActiva) && !formularioActivo && (
                  <Boton
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      setFormularioActivo({});
                      setElementoDetalle(null);
                      setElementoABorrar(null);
                    }}
                  >
                    + Crear {vistaActiva === "Usuarios" ? "Usuario" : "Producto"}
                  </Boton>
                )}
              </div>

              {/* Alertas globales */}
              {mensajeAviso && <div className="alert alert-success">{mensajeAviso}</div>}
              {mensajeError && (
                <div className="alert alert-danger d-flex justify-content-between">
                  <span>{mensajeError}</span>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setContadorRefresco((n) => n + 1)}>
                    Reintentar
                  </button>
                </div>
              )}

              {/* ÁREA DE TRABAJO: Formulario o Lista de Registros */}
              {formularioActivo && esAdministrador ? (
                <div className="bg-light p-4 rounded border">
                  <h3 className="h5 mb-4">
                    {formularioActivo.codigo || formularioActivo.id ? "Editar" : "Nuevo Registro"}
                  </h3>
                  <FormularioTienda
                    key={formularioActivo.id || formularioActivo.codigo || "nuevo"}
                    tipo={vistaActiva === "Usuarios" ? "cuenta" : "producto"}
                    inicial={formularioActivo}
                    administrar
                    alEnviar={guardarRegistro}
                  />
                  <div className="mt-3 text-end">
                    <Boton className="btn btn-secondary" onClick={() => setFormularioActivo(null)}>
                      Cancelar
                    </Boton>
                  </div>
                </div>
              ) : (
                <>
                  {cargandoDatos ? (
                    <div className="text-center py-5 text-muted">Cargando registros...</div>
                  ) : !listaDatos.length ? (
                    <div className="text-center py-5 text-muted">No hay registros para mostrar.</div>
                  ) : (
                    <div className="list-group">
                      {listaDatos.map((registro) => (
                        <div key={registro.id || registro.codigo} className="list-group-item py-3">

                          {/* Cabecera del registro */}
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0 fs-6 fw-bold">
                              {vistaActiva === "Productos" ? registro.nombre
                                : vistaActiva === "Usuarios" ? `${registro.nombre} ${registro.apellidos}`
                                  : vistaActiva === "Órdenes" ? `Orden #${registro.id}`
                                    : registro.asunto}
                            </h5>

                            {/* Botones de acción de la fila */}
                            <div className="btn-group btn-group-sm">
                              <Boton
                                className="btn btn-outline-primary"
                                onClick={() => setElementoDetalle(elementoDetalle === registro ? null : registro)}
                              >
                                {elementoDetalle === registro ? "Ocultar" : "Detalle"}
                              </Boton>

                              {esAdministrador && ["Productos", "Usuarios"].includes(vistaActiva) && (
                                <>
                                  <Boton
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                      setFormularioActivo(registro);
                                      setElementoABorrar(null);
                                    }}
                                  >
                                    Editar
                                  </Boton>
                                  <Boton
                                    className="btn btn-outline-danger"
                                    disabled={vistaActiva === "Usuarios" && registro.id === usuario.id}
                                    onClick={() => setElementoABorrar(registro)}
                                  >
                                    Eliminar
                                  </Boton>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Info específica de productos en la fila principal */}
                          {vistaActiva === "Productos" && (
                            <div className="text-muted small">
                              <span>{pesos(registro.precio)} · Stock: {registro.stock}</span>
                              {registro.critico != null && registro.stock <= registro.critico && (
                                <span className="badge bg-warning text-dark ms-2">Stock crítico</span>
                              )}
                            </div>
                          )}

                          {/* Acordeón de Detalles */}
                          {elementoDetalle === registro && (
                            <div className="bg-light p-3 mt-3 rounded border">
                              {vistaActiva === "Productos" ? (
                                <p className="mb-0 small text-muted">
                                  <strong>Código:</strong> {registro.codigo} <br />
                                  <strong>Categoría:</strong> {registro.categoria} <br />
                                  <strong>Descripción:</strong> {registro.descripcion || "Sin descripción."}
                                </p>
                              ) : vistaActiva === "Usuarios" ? (
                                <p className="mb-0 small text-muted">
                                  <strong>Rol:</strong> {registro.rol} · <strong>RUN:</strong> {registro.run} <br />
                                  <strong>Email:</strong> {registro.email} <br />
                                  <strong>Dirección:</strong> {registro.direccion}, {registro.comuna}, {registro.region}
                                </p>
                              ) : vistaActiva === "Mensajes" ? (
                                <div className="small text-muted">
                                  <strong>De:</strong> {registro.nombre} ({registro.email}) <hr className="my-2" />
                                  <p className="mb-0">{registro.mensaje}</p>
                                </div>
                              ) : (
                                <div className="small text-muted">
                                  <p className="mb-2">
                                    <strong>Cliente:</strong> {registro.cliente} <br />
                                    <strong>Fecha:</strong> {new Date(registro.fecha).toLocaleString("es-CL")}
                                  </p>
                                  <ul className="mb-2 ps-3">
                                    {registro.lineas.map((linea) => (
                                      <li key={linea.codigo}>
                                        {linea.cantidad} × {linea.nombre} · {pesos(linea.precio)}
                                      </li>
                                    ))}
                                  </ul>
                                  <strong>Total pagado: {pesos(registro.total)}</strong>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Confirmación de Borrado */}
                          {elementoABorrar === registro && (
                            <div className="alert alert-danger mt-3 mb-0 d-flex justify-content-between align-items-center">
                              <span className="small fw-bold">¿Eliminar permanentemente a {registro.nombre}?</span>
                              <div>
                                <Boton className="btn btn-sm btn-danger me-2" onClick={eliminarRegistro}>Sí, eliminar</Boton>
                                <Boton className="btn btn-sm btn-secondary" onClick={() => setElementoABorrar(null)}>Cancelar</Boton>
                              </div>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </PlantillaPagina>
  );
}