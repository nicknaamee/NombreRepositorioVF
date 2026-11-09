import test, { before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import http from "node:http";
import handler from "../api/index.js";
import { validar, runValido } from "../src/services/reglas.js";
import { regiones } from "../src/services/regiones.js";
let server, url, dir, admin, client, seller;
const registro = {
  run: "190110222",
  nombre: "Ana",
  apellidos: "Pérez",
  email: "ana@gmail.com",
  clave: "abcd1234",
  direccion: "Calle Uno 23",
  region: "Tarapacá",
  comuna: "Iquique",
};
const post = async (accion, datos = {}, cookie = "") => {
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify({ accion, datos }),
  });
  return {
    status: r.status,
    body: await r.json(),
    cookie: r.headers.get("set-cookie")?.split(";")[0],
  };
};
before(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "tienda-test-"));
  process.env.TIENDA_DB = path.join(dir, "db.json");
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.VERCEL;
  process.env.ADMIN_EMAIL = "admin@duoc.cl";
  process.env.ADMIN_PASSWORD = "Prueba123";
  server = http.createServer(handler);
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  url = "http://127.0.0.1:" + server.address().port;
});
after(async () => {
  await new Promise((r) => server.close(r));
  await rm(dir, { recursive: true, force: true });
});
beforeEach(async (ctx) => {
  process.env.TIENDA_DB = path.join(
    dir,
    encodeURIComponent(ctx.name) + ".json",
  );
  admin = (
    await post("login", {
      email: process.env.ADMIN_EMAIL,
      clave: process.env.ADMIN_PASSWORD,
    })
  ).cookie;
  if (!ctx.name.startsWith("registro público"))
    client = (await post("registro", registro)).cookie;
  if (!ctx.name.startsWith("administrador crea")) {
    await post(
      "usuario",
      {
        ...registro,
        run: "123456785",
        email: "vendedor@profesor.duoc.cl",
        rol: "Vendedor",
      },
      admin,
    );
    seller = (
      await post("login", {
        email: "vendedor@profesor.duoc.cl",
        clave: registro.clave,
      })
    ).cookie;
  }
});
test("valida RUN, nombres, fecha, dominio y las 346 comunas", () => {
  assert.equal(Object.keys(regiones).length, 16);
  assert.equal(Object.values(regiones).flat().length, 346);
  assert.ok(runValido(registro.run));
  assert.ok(!runValido("190110221"));
  assert.deepEqual(validar("cuenta", registro), {});
  const e = validar("cuenta", {
    ...registro,
    nombre: "Ana2",
    email: "a@duoc.cl.otro",
    comuna: "Santiago",
    fecha: "2024-02-31",
  });
  for (const k of ["nombre", "email", "comuna", "fecha"]) assert.ok(e[k]);
});
test("registro público no concede rol, rechaza duplicados y protege datos", async () => {
  const r = await post("registro", { ...registro, rol: "Administrador" });
  assert.equal(r.status, 200);
  assert.equal(r.body.rol, "Cliente");
  client = r.cookie;
  assert.equal((await post("registro", registro)).status, 409);
  assert.equal((await post("usuarios", {}, client)).status, 403);
  assert.equal((await post("ordenes")).status, 403);
});
test("administrador crea vendedor; vendedor consulta pero no modifica", async () => {
  const d = {
    ...registro,
    run: "123456785",
    email: "vendedor@profesor.duoc.cl",
    rol: "Vendedor",
  };
  assert.equal((await post("usuario", d, admin)).status, 200);
  seller = (await post("login", { email: d.email, clave: d.clave })).cookie;
  assert.equal((await post("ordenes", {}, seller)).status, 200);
  assert.equal((await post("usuario", d, seller)).status, 403);
  assert.equal(
    (
      await post(
        "comprar",
        { lineas: [{ codigo: "OBJ01", cantidad: 1 }] },
        seller,
      )
    ).status,
    403,
  );
  assert.equal(
    (await post("borrarProducto", { codigo: "OBJ01" }, seller)).status,
    403,
  );
});
test("valida stock entero, precio decimal, edición, duplicados y borrado", async () => {
  const d = {
    codigo: "TEST",
    nombre: "Hoja",
    categoria: "Papel",
    precio: "1,25",
    stock: 2,
    critico: 2,
  };
  assert.equal(
    (await post("producto", { ...d, stock: "1.5" }, admin)).status,
    400,
  );
  assert.equal(
    (await post("producto", { ...d, precio: -1 }, admin)).status,
    400,
  );
  assert.equal((await post("producto", d, admin)).body.precio, 1.25);
  assert.equal((await post("producto", d, admin)).status, 409);
  assert.equal(
    (await post("producto", { ...d, editar: true, precio: "0" }, admin)).body
      .precio,
    0,
  );
  assert.equal(
    (await post("borrarProducto", { codigo: "TEST" }, admin)).status,
    200,
  );
});
test("checkout exige sesión; no descuenta parcialmente si falta stock", async () => {
  const lineas = [
    { codigo: "OBJ01", cantidad: 1 },
    { codigo: "FOC01", cantidad: 999 },
  ];
  assert.equal((await post("comprar", { lineas })).status, 401);
  assert.equal((await post("comprar", { lineas }, client)).status, 409);
  assert.equal(
    (await post("catalogo")).body.find((p) => p.codigo === "OBJ01").stock,
    8,
  );
});
test("pedido confirmado calcula total en servidor y queda visible al vendedor", async () => {
  const r = await post(
    "comprar",
    { lineas: [{ codigo: "OBJ01", cantidad: 2, precio: 0 }], total: 0 },
    client,
  );
  assert.equal(r.status, 200);
  assert.equal(r.body.total, 1000);
  assert.equal(
    (await post("catalogo")).body.find((p) => p.codigo === "OBJ01").stock,
    6,
  );
  assert.equal((await post("ordenes", {}, seller)).body[0].id, r.body.id);
});
test("dos compras simultáneas no venden dos veces la última unidad", async () => {
  const d = {
    codigo: "ULT",
    nombre: "Último",
    categoria: "Otros",
    precio: "1",
    stock: 1,
  };
  await post("producto", d, admin);
  const orden = { lineas: [{ codigo: "ULT", cantidad: 1 }] };
  const rs = await Promise.all([
    post("comprar", orden, client),
    post("comprar", orden, client),
  ]);
  assert.deepEqual(rs.map((r) => r.status).sort(), [200, 409]);
});
test("el mensaje solo se confirma si es válido y solo admin puede leerlo", async () => {
  const d = {
    nombre: "Ana Pérez",
    email: "ana@gmail.com",
    asunto: "Caja",
    mensaje: "¿Hay stock?",
  };
  assert.equal((await post("contacto", { ...d, email: "@" })).status, 400);
  assert.equal((await post("contacto", d)).status, 200);
  assert.equal((await post("mensajes", {}, seller)).status, 403);
  assert.equal((await post("mensajes", {}, admin)).body[0].mensaje, d.mensaje);
});
test("cierre invalida la sesión; una clave incorrecta no autentica", async () => {
  assert.equal((await post("salir", {}, seller)).status, 200);
  assert.equal((await post("ordenes", {}, seller)).status, 403);
  assert.equal(
    (await post("login", { email: registro.email, clave: "xxxx" })).status,
    401,
  );
});
