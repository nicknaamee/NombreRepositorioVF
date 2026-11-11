import React from "react";
import { screen, fireEvent } from "@testing-library/react/pure";
import { montar } from "../tienda-util.jsx";
import Administracion from "../../src/components/pages/Administracion.jsx";
import { tiendaAPI } from "../../src/services/api.js";
describe("Administracion", () => {
  it("impide el panel al cliente", () => {
    const api = spyOn(tiendaAPI, "pedir");
    montar(<Administracion />, { usuario: { rol: "Cliente" } });
    expect(screen.getByText("Acceso restringido.")).toBeTruthy();
    expect(api).not.toHaveBeenCalled();
  });
  it("el vendedor ve órdenes sin acciones de edición", async () => {
    spyOn(tiendaAPI, "pedir").and.resolveTo([]);
    montar(<Administracion />, { usuario: { rol: "Vendedor" } });
    await screen.findByText("No hay registros.");
    expect(screen.getByText("Órdenes")).toBeTruthy();
    expect(screen.queryByText("Usuarios")).toBeNull();
    expect(screen.queryByText("Crear producto")).toBeNull();
  });
  it("permite al administrador crear un producto", async () => {
    spyOn(tiendaAPI, "pedir").and.resolveTo([]);
    montar(<Administracion />, { usuario: { rol: "Administrador" } });
    await screen.findByText("No hay registros.");
    fireEvent.click(screen.getByText("Crear producto"));
    expect(screen.getByLabelText("Precio en pesos")).toBeTruthy();
  });
});
