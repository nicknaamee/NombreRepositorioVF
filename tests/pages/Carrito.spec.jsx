import React from "react";
import { screen, fireEvent } from "@testing-library/react/pure";
import { montar } from "../tienda-util.jsx";
import Carrito from "../../src/components/pages/Carrito.jsx";
import { tiendaAPI } from "../../src/services/api.js";
const lineas = [{ codigo: "OBJ01", cantidad: 2 }];
describe("Carrito", () => {
  it("muestra el estado vacío", () => {
    montar(<Carrito />);
    expect(screen.getByText("El carrito está vacío.")).toBeTruthy();
  });
  it("conserva la vuelta al carrito al pedir acceso", () => {
    montar(<Carrito />, { lineas });
    expect(screen.getByText("Inicia sesión para comprar").href).toContain(
      "volver=carrito",
    );
  });
  it("registra y limpia el carrito solo tras la confirmación", async () => {
    const api = spyOn(tiendaAPI, "pedir").and.resolveTo({
      id: "demo",
      total: 1000,
    });
    montar(<Carrito />, { lineas, usuario: { rol: "Cliente" } });
    fireEvent.click(screen.getByText("Confirmar compra"));
    await screen.findByText("Compra registrada");
    expect(api).toHaveBeenCalledWith("comprar", { lineas });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "tienda.carrito.v1",
      "[]",
    );
  });
});
