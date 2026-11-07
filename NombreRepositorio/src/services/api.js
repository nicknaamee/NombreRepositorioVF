export const tiendaAPI = {
  async pedir(accion, datos = {}) {
    const r = await fetch("./api/index", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion, datos }),
    });
    if (!r.headers.get("content-type")?.includes("application/json"))
      throw Error(
        "El servicio no está disponible. Inicia la aplicación con npm run dev.",
      );
    const j = await r.json();
    if (!r.ok) throw Error(j.error || "La solicitud no se pudo completar.");
    return j;
  },
};
