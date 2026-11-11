import { ejecutar } from "../server/tienda.js";
export default async function handler(req, res) {
  const send = (n, v) => {
    res.statusCode = n;
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(v));
  };
  if (req.method !== "POST") return send(405, { error: "Usa POST." });
  if (!req.headers["content-type"]?.startsWith("application/json"))
    return send(415, { error: "Se requiere JSON." });
  try {
    const origen = req.headers.origin;
    if (origen && new URL(origen).host !== req.headers.host)
      return send(403, { error: "Origen inválido." });
    let body = req.body;
    if (body === undefined) {
      let buf = "";
      for await (const c of req) {
        buf += c;
        if (buf.length > 65536)
          return send(413, { error: "Solicitud demasiado grande." });
      }
      body = buf;
    }
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return send(400, { error: "JSON inválido." });
      }
    }
    const token = (req.headers.cookie || "").match(
      /(?:^|;\s*)tienda_session=([a-f0-9]{64})/,
    )?.[1];
    const r = await ejecutar(body?.accion, body?.datos || {}, token);
    if (r.error) return send(r.status, { error: r.error });
    if (r.token !== undefined)
      res.setHeader(
        "Set-Cookie",
        "tienda_session=" +
          r.token +
          "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" +
          (r.token ? 28800 : 0) +
          (process.env.VERCEL || req.socket?.encrypted ? "; Secure" : ""),
      );
    send(200, r.value);
  } catch (e) {
    send(e.status || 500, {
      error: e.status
        ? e.message
        : "No se pudo acceder al servicio de la tienda.",
    });
  }
}
