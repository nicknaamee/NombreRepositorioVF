import React from "react";
import { render, screen } from "@testing-library/react/pure";
import CatalogoProductos from "../../src/components/organisms/CatalogoProductos.jsx";
import { iniciales } from "../../src/services/semilla.js";

describe("CatalogoProductos", () => {
  it("muestra una ficha por producto", () => {
    render(<CatalogoProductos productos={iniciales} />);
    expect(screen.getAllByRole("article").length).toBe(iniciales.length);
    iniciales.forEach((producto) =>
      expect(screen.getByRole("link", { name: producto.nombre })).toBeTruthy(),
    );
  });
  it("no inventa productos cuando la lista está vacía", () => {
    render(<CatalogoProductos productos={[]} />);
    expect(screen.queryAllByRole("article").length).toBe(0);
  });
  it("retira una ficha cuando cambia el catálogo", () => {
    const vista = render(<CatalogoProductos productos={iniciales} />);
    vista.rerender(<CatalogoProductos productos={iniciales.slice(1)} />);
    expect(
      screen.queryByRole("link", { name: iniciales[0].nombre }),
    ).toBeNull();
    expect(screen.getAllByRole("article").length).toBe(iniciales.length - 1);
  });
});
