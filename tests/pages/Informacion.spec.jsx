import React from "react";
import { screen } from "@testing-library/react/pure";
import { montar, ruta } from "../tienda-util.jsx";
import Informacion from "../../src/components/pages/Informacion.jsx";
describe("Informacion", () => {
  it("presenta a los integrantes", () => {
    ruta("/info.html");
    montar(<Informacion />);
    expect(screen.getByText(/Paola Fuentes/)).toBeTruthy();
  });
  it("ofrece dos notas", () => {
    ruta("/info.html?blog=");
    montar(<Informacion />);
    expect(screen.getAllByText("Leer nota").length).toBe(2);
  });
  it("abre la nota elegida y permite volver", () => {
    ruta("/info.html?blog=foca");
    montar(<Informacion />);
    expect(screen.getByText(/La foca que estaba/)).toBeTruthy();
    expect(screen.getByText("Volver al blog").href).toContain("blog=");
  });
});
