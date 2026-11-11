import React from "react";
import { screen, fireEvent } from "@testing-library/react/pure";
import { montar } from "../tienda-util.jsx";
import FichaProducto from "../../src/components/molecules/FichaProducto.jsx";
import { iniciales } from "../../src/services/semilla.js";
describe("FichaProducto", () => {
  it("abre el detalle mediante el código", () => {
    montar(<FichaProducto producto={iniciales[0]} />);
    expect(screen.getByRole("link").href).toContain("producto=OBJ01");
  });
  it("persiste una unidad al añadir", () => {
    montar(<FichaProducto producto={iniciales[0]} />);
    fireEvent.click(screen.getByRole("button"));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "tienda.carrito.v1",
      '[{"codigo":"OBJ01","cantidad":1}]',
    );
  });
  it("bloquea productos sin existencias", () => {
    montar(<FichaProducto producto={{ ...iniciales[0], stock: 0 }} />);
    expect(screen.getByRole("button").disabled).toBeTrue();
  });
});
