const key = "tienda.carrito.v1";
export function leerCarrito() {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data)
      ? data.filter(
          (x) =>
            typeof x?.codigo === "string" &&
            Number.isSafeInteger(x.cantidad) &&
            x.cantidad > 0,
        )
      : [];
  } catch {
    return [];
  }
}
export function escribirCarrito(lineas) {
  localStorage.setItem(key, JSON.stringify(lineas));
  window.dispatchEvent(new Event("carrito"));
}
export function ajustar(producto, cantidad) {
  if (
    !Number.isSafeInteger(cantidad) ||
    cantidad < 0 ||
    cantidad > producto.stock
  )
    throw Error("La cantidad supera el stock disponible.");
  const otras = leerCarrito().filter((x) => x.codigo !== producto.codigo);
  escribirCarrito(
    cantidad ? [...otras, { codigo: producto.codigo, cantidad }] : otras,
  );
}
export function agregar(p) {
  ajustar(
    p,
    (leerCarrito().find((x) => x.codigo === p.codigo)?.cantidad || 0) + 1,
  );
}
export const pesos = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
