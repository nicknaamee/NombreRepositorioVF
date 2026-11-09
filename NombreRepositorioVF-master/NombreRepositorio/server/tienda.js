import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { transaccion } from "./store.js";
import { validar, correoNormal } from "../src/services/reglas.js";
const hash = (s) => createHash("sha256").update(s).digest("hex");
function clave(s, sal = randomBytes(16).toString("hex")) {
  return sal + ":" + scryptSync(s, sal, 32).toString("hex");
}
function coincide(s, cuenta) {
  const sal = cuenta?.hash.split(":")[0] || "00000000000000000000000000000000";
  const h = clave(s, sal);
  return !!cuenta && timingSafeEqual(Buffer.from(h), Buffer.from(cuenta.hash));
}
class Fallo extends Error {
  constructor(msg, status = 400) {
    super(msg);
    this.status = status;
  }
}
const exigir = (ok, msg, status) => {
  if (!ok) throw new Fallo(msg, status);
};
const revisar = (tipo, d, op) => {
  const mensaje = Object.values(validar(tipo, d, op))[0];
  exigir(!mensaje, mensaje);
};
const publico = ({ hash: _, ...u }) => u;
const sesionPublica = (u) =>
  u ? { id: u.id, nombre: u.nombre, rol: u.rol, email: u.email } : null;
const perfil = (d, rol) => ({
  nombre: d.nombre.trim(),
  apellidos: d.apellidos.trim(),
  run: d.run.trim().toUpperCase(),
  email: correoNormal(d.email),
  region: d.region,
  comuna: d.comuna,
  direccion: d.direccion.trim(),
  fecha: d.fecha || "",
  rol,
});
function unico(db, p, id) {
  exigir(
    !db.usuarios.some(
      (u) => u.id !== id && (u.email === p.email || u.run === p.run),
    ),
    "Ya existe una cuenta con ese correo o RUN.",
    409,
  );
}
function sesion(db, u) {
  const token = randomBytes(32).toString("hex");
  db.sesiones = db.sesiones.filter((s) => s.expira > Date.now());
  db.sesiones.push({
    digest: hash(token),
    id: u.id,
    expira: Date.now() + 8 * 3600000,
  });
  return { value: sesionPublica(u), token };
}
export async function ejecutar(accion, d, token) {
  return transaccion((db) => {
    if (!db.usuarios.length) {
      exigir(
        process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD,
        "Configura la cuenta administrativa inicial en el servidor.",
        503,
      );
      const correo = correoNormal(process.env.ADMIN_EMAIL);
      revisar("login", { email: correo, clave: process.env.ADMIN_PASSWORD });
      db.usuarios.push({
        id: randomUUID(),
        nombre: "Administrador",
        apellidos: "Inicial",
        email: correo,
        run: "",
        region: "",
        comuna: "",
        direccion: "",
        fecha: "",
        rol: "Administrador",
        hash: clave(process.env.ADMIN_PASSWORD),
      });
    }
    const s = db.sesiones.find(
      (x) => x.digest === hash(token || "") && x.expira > Date.now(),
    );
    const u = db.usuarios.find((x) => x.id === s?.id);
    const staff = () =>
      exigir(
        u && ["Administrador", "Vendedor"].includes(u.rol),
        "Acceso restringido.",
        403,
      );
    const admin = () =>
      exigir(u?.rol === "Administrador", "Solo administradores.", 403);
    const out = (value) => ({ value });
    switch (accion) {
      case "catalogo":
        return out(db.productos);
      case "sesion":
        return out(sesionPublica(u));
      case "login": {
        revisar("login", d);
        const email = correoNormal(d.email),
          k = hash(email);
        const a = db.intentos[k];
        if (a?.hasta > Date.now() && a.n >= 8)
          throw new Fallo("Demasiados intentos. Espera diez minutos.", 429);
        const cuenta = db.usuarios.find((x) => x.email === email);
        if (!coincide(d.clave, cuenta)) {
          db.intentos[k] = {
            n: (a?.hasta > Date.now() ? a.n : 0) + 1,
            hasta: a?.hasta > Date.now() ? a.hasta : Date.now() + 600000,
          };
          return { error: "Correo o contraseña incorrectos.", status: 401 };
        }
        delete db.intentos[k];
        return sesion(db, cuenta);
      }
      case "salir":
        db.sesiones = db.sesiones.filter((x) => x.digest !== hash(token || ""));
        return { value: true, token: "" };
      case "registro":
      case "usuario": {
        const gestion = accion === "usuario";
        if (gestion) admin();
        const antiguo =
          gestion && d.id ? db.usuarios.find((x) => x.id === d.id) : null;
        if (gestion && d.id) exigir(antiguo, "Usuario inexistente.", 404);
        const rol = gestion ? d.rol : "Cliente";
        revisar("cuenta", { ...d, rol }, { editar: !!antiguo });
        exigir(
          ["Administrador", "Cliente", "Vendedor"].includes(rol),
          "Perfil inválido.",
        );
        if (antiguo && antiguo.id === u?.id)
          exigir(rol === "Administrador", "No puedes quitarte el acceso.");
        const p = perfil(d, rol);
        unico(db, p, antiguo?.id);
        const cuenta = {
          ...p,
          id: antiguo?.id || randomUUID(),
          hash: d.clave ? clave(d.clave) : antiguo.hash,
        };
        if (antiguo) {
          Object.assign(antiguo, cuenta);
          if (d.clave || antiguo.id !== u?.id)
            db.sesiones = db.sesiones.filter((x) => x.id !== antiguo.id);
        } else db.usuarios.push(cuenta);
        return gestion ? out(publico(cuenta)) : sesion(db, cuenta);
      }
      case "usuarios":
        admin();
        return out(db.usuarios.map(publico));
      case "borrarUsuario":
        admin();
        exigir(d.id !== u.id, "No puedes eliminar tu propia cuenta.");
        exigir(
          db.usuarios.some((x) => x.id === d.id),
          "Usuario inexistente.",
          404,
        );
        db.usuarios = db.usuarios.filter((x) => x.id !== d.id);
        db.sesiones = db.sesiones.filter((x) => x.id !== d.id);
        return out(true);
      case "producto": {
        admin();
        revisar("producto", d);
        const codigo = d.codigo.trim().toUpperCase();
        const anterior = db.productos.find((x) => x.codigo === codigo);
        exigir(
          d.editar ? !!anterior : !anterior,
          d.editar ? "Producto inexistente." : "El código ya existe.",
          409,
        );
        const p = {
          codigo,
          nombre: d.nombre.trim(),
          descripcion: (d.descripcion || "").trim(),
          precio: Number(String(d.precio).replace(",", ".")),
          stock: Number(d.stock),
          critico:
            d.critico === "" || d.critico == null ? null : Number(d.critico),
          categoria: d.categoria,
          imagen: d.imagen || "",
        };
        if (anterior) Object.assign(anterior, p);
        else db.productos.push(p);
        return out(p);
      }
      case "borrarProducto":
        admin();
        exigir(
          db.productos.some((x) => x.codigo === d.codigo),
          "Producto inexistente.",
          404,
        );
        db.productos = db.productos.filter((x) => x.codigo !== d.codigo);
        return out(true);
      case "comprar": {
        exigir(u, "Inicia sesión para confirmar.", 401);
        exigir(
          u.rol !== "Vendedor",
          "El vendedor solo consulta productos y órdenes.",
          403,
        );
        exigir(
          Array.isArray(d.lineas) &&
            d.lineas.length > 0 &&
            d.lineas.length <= 100,
          "Carrito inválido.",
        );
        const vistos = new Set();
        let centavos = 0;
        const lineas = d.lineas.map(({ codigo, cantidad }) => {
          const p = db.productos.find((x) => x.codigo === codigo);
          exigir(
            p &&
              !vistos.has(codigo) &&
              Number.isSafeInteger(cantidad) &&
              cantidad > 0 &&
              cantidad <= p.stock,
            "Revisa tu carrito: producto no disponible o stock insuficiente.",
            409,
          );
          vistos.add(codigo);
          centavos += Math.round(p.precio * 100) * cantidad;
          exigir(Number.isSafeInteger(centavos), "Total fuera de rango.");
          p.stock -= cantidad;
          return { codigo, nombre: p.nombre, precio: p.precio, cantidad };
        });
        const orden = {
          id: randomUUID(),
          fecha: new Date().toISOString(),
          cliente: u.nombre,
          usuario: u.id,
          lineas,
          total: centavos / 100,
        };
        db.ordenes.push(orden);
        return out(orden);
      }
      case "ordenes":
        staff();
        return out(db.ordenes.slice().reverse());
      case "contacto":
        revisar("contacto", d);
        db.mensajes.push({
          id: randomUUID(),
          fecha: new Date().toISOString(),
          nombre: d.nombre.trim(),
          email: correoNormal(d.email),
          asunto: d.asunto.trim(),
          mensaje: d.mensaje.trim(),
        });
        return out(true);
      case "mensajes":
        admin();
        return out(db.mensajes.slice().reverse());
      default:
        throw new Fallo("Acción inexistente.", 404);
    }
  });
}
