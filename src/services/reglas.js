import { regiones } from "./regiones.js";
export const roles = ["Administrador", "Vendedor", "Cliente"];
export const categorias = ["Objetos", "Papel", "Otros"];
export const correoNormal = (s) =>
  String(s ?? "")
    .trim()
    .toLowerCase();
const str = (v) => (typeof v === "string" ? v.trim() : "");
export const nombreValido = (s, max) =>
  str(s).length <= max &&
  /^\p{L}[\p{L}\p{M}]*(?:[ '’-][\p{L}\p{M}]+)*$/u.test(str(s));
export function correoError(v) {
  const s = correoNormal(v);
  if (!s) return "Por favor, ingresa tu correo electrónico.";
  if (
    s.length > 100 ||
    !/^[a-z0-9_%+-]+(?:\.[a-z0-9_%+-]+)*@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(
      s,
    )
  )
    return "Por favor, ingresa un correo válido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com.";
}
export function runValido(v) {
  const s = str(v).toUpperCase();
  if (!/^[1-9]\d{5,7}[\dK]$/.test(s)) return false;
  let n = 0,
    peso = 2;
  for (const d of s.slice(0, -1).split("").reverse()) {
    n += Number(d) * peso;
    peso = peso === 7 ? 2 : peso + 1;
  }
  return "0123456789K"[(11 - (n % 11)) % 11] === s.at(-1);
}
export function validar(tipo, d, opciones = {}) {
  const e = {};
  const requerido = (k, max, msg) => {
    if (!str(d[k]) || str(d[k]).length > max) e[k] = msg;
  };
  if (["cuenta", "login", "contacto"].includes(tipo)) {
    const msg = correoError(d.email);
    if (msg) e.email = msg;
  }
  if (
    ["login", "cuenta"].includes(tipo) &&
    !(opciones.editar && !d.clave) &&
    (typeof d.clave !== "string" ||
      d.clave.length < 4 ||
      d.clave.length > 10 ||
      !d.clave.trim())
  )
    e.clave = "Usa entre 4 y 10 caracteres.";
  if (tipo === "cuenta") {
    if (!runValido(d.run))
      e.run =
        "RUN con dígito verificador, sin puntos ni guion. Ej.: 190110222.";
    if (!nombreValido(d.nombre, 50))
      e.nombre = "Escribe un nombre con letras, hasta 50 caracteres.";
    if (!nombreValido(d.apellidos, 100))
      e.apellidos = "Escribe tus apellidos con letras, hasta 100 caracteres.";
    if (
      d.fecha &&
      (!/^\d{4}-\d\d-\d\d$/.test(d.fecha) ||
        !Number.isFinite(Date.parse(d.fecha)) ||
        new Date(d.fecha).toISOString().slice(0, 10) !== d.fecha ||
        d.fecha > new Date().toISOString().slice(0, 10))
    )
      e.fecha = "Ingresa una fecha válida que no sea futura.";
    if (!Object.hasOwn(regiones, d.region)) e.region = "Selecciona una región.";
    if (
      !Object.hasOwn(regiones, d.region) ||
      !regiones[d.region].includes(d.comuna)
    )
      e.comuna = "Selecciona una comuna de esa región.";
    requerido(
      "direccion",
      300,
      "Escribe tu dirección (máximo 300 caracteres).",
    );
    if (!e.direccion && !/\p{L}/u.test(d.direccion))
      e.direccion = "Incluye el nombre de la calle o sector.";
    if (d.rol && !roles.includes(d.rol)) e.rol = "Selecciona un perfil válido.";
  }
  if (tipo === "contacto") {
    if (!str(d.nombre)) e.nombre = "Por favor, ingresa tu nombre completo.";
    else if (!nombreValido(d.nombre, 100))
      e.nombre = "Usa solo letras en el nombre (máximo 100 caracteres).";
    requerido("asunto", 100, "Por favor, ingresa un asunto.");
    requerido("mensaje", 500, "Por favor, ingresa tu mensaje.");
    if (str(d.mensaje).length > 500) e.mensaje = "Máximo 500 caracteres.";
  }
  if (tipo === "producto") {
    if (!/^[\p{L}\d_-]{3,}$/u.test(str(d.codigo)))
      e.codigo = "Usa al menos 3 letras, números, guiones o guiones bajos.";
    requerido("nombre", 100, "Nombre requerido (máximo 100 caracteres).");
    if (str(d.descripcion).length > 500)
      e.descripcion = "Máximo 500 caracteres.";
    if (
      !/^\d+(?:[.,]\d{1,2})?$/.test(String(d.precio ?? "")) ||
      !Number.isSafeInteger(
        Math.round(Number(String(d.precio).replace(",", ".")) * 100),
      )
    )
      e.precio = "Ingresa un precio desde 0, con hasta dos decimales.";
    for (const k of ["stock", "critico"])
      if (
        !(k === "critico" && (d[k] === "" || d[k] == null)) &&
        (!/^\d+$/.test(String(d[k] ?? "")) ||
          !Number.isSafeInteger(Number(d[k])))
      )
        e[k] = "Ingresa un entero desde 0.";
    if (!categorias.includes(d.categoria))
      e.categoria = "Selecciona una categoría.";
    if (
      d.imagen &&
      !/^https:\/\/[^\s]+$/i.test(d.imagen) &&
      d.imagen !== "img/foca.jpeg"
    )
      e.imagen = "Usa una dirección https:// o deja el campo vacío.";
  }
  return e;
}
