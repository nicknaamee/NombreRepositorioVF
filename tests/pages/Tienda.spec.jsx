import React from "react";
import { screen, within } from "@testing-library/react/pure";
import { montar, ruta } from "../tienda-util.jsx";
import Tienda from "../../src/components/pages/Tienda.jsx";
describe("Tienda", () => {
  it("presenta los productos disponibles", () => {
    ruta("/tienda.html");
    montar(<Tienda />);
    expect(
      within(screen.getByRole("main")).getAllByRole("article").length,
    ).toBe(3);
  });
  it("muestra un detalle con descripción", () => {
    ruta("/tienda.html?producto=OBJ01");
    montar(<Tienda />);
    expect(screen.getByText("Una caja para guardar algo.")).toBeTruthy();
  });
  it("permite volver desde un código inexistente", () => {
    ruta("/tienda.html?producto=no");
    montar(<Tienda />);
    expect(screen.getByText("Producto no disponible.")).toBeTruthy();
    expect(screen.getByText("Volver a productos").href).toContain(
      "tienda.html",
    );
  });
});
