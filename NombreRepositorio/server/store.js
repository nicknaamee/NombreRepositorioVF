import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
import { randomUUID } from "node:crypto";
import { iniciales } from "../src/services/semilla.js";
const vacio = () => ({
  productos: structuredClone(iniciales),
  usuarios: [],
  ordenes: [],
  mensajes: [],
  sesiones: [],
  intentos: {},
});
const file = () =>
  path.resolve(
    process.env.TIENDA_DB ||
      path.join(
        homedir(),
        ".subdireccion-tienda",
        createHash("sha256").update(process.cwd()).digest("hex").slice(0, 12),
        "tienda.json",
      ),
  );
const key = "subdireccion:tienda:v1";
let cola = Promise.resolve();
async function redis(cmd) {
  const r = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
  });
  const j = await r.json();
  if (!r.ok || j.error) throw Error("Almacén no disponible");
  return j.result;
}
export function transaccion(fn) {
  const work = async () => {
    const remoto = Boolean(process.env.UPSTASH_REDIS_REST_URL);
    if (process.env.VERCEL && !remoto)
      throw Error("Configura el almacenamiento persistente del servidor.");
    for (let i = 0; i < 6; i++) {
      let raw;
      if (remoto) raw = await redis(["GET", key]);
      else
        try {
          raw = await readFile(file(), "utf8");
        } catch (e) {
          if (e.code !== "ENOENT") throw e;
        }
      const db = raw ? JSON.parse(raw) : vacio();
      const result = await fn(db);
      const next = JSON.stringify(db);
      if (next === raw) return result;
      if (remoto) {
        const lua =
          "local a=redis.call('GET',KEYS[1]); if (a or '')~=ARGV[1] then return 0 end; redis.call('SET',KEYS[1],ARGV[2]); return 1";
        if (!(await redis(["EVAL", lua, 1, key, raw || "", next]))) continue;
      } else {
        await mkdir(path.dirname(file()), { recursive: true });
        const tmp = file() + "." + randomUUID();
        await writeFile(tmp, next, { mode: 0o600 });
        await rename(tmp, file());
      }
      return result;
    }
    throw Error("Actualización simultánea. Intenta nuevamente.");
  };
  const res = cola.then(work, work);
  cola = res.catch(() => {});
  return res;
}
