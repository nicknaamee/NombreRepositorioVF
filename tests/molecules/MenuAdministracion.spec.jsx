import React from "react";
import { render, screen, fireEvent } from "@testing-library/react/pure";
import MenuAdministracion from "../../src/components/molecules/MenuAdministracion.jsx";

describe("MenuAdministracion", () => {
  it("ofrece las cuatro secciones al administrador", () => {
    render(<MenuAdministracion rol="Administrador" vista="Productos" />);
    expect(
      screen.getAllByRole("button").map((boton) => boton.textContent),
    ).toEqual(["Productos", "Usuarios", "Órdenes", "Mensajes"]);
  });
  it("limita las secciones del vendedor", () => {
    render(<MenuAdministracion rol="Vendedor" vista="Productos" />);
    expect(
      screen.getAllByRole("button").map((boton) => boton.textContent),
    ).toEqual(["Productos", "Órdenes"]);
  });
  it("comunica el cambio y señala la sección activa", () => {
    const cambiar = jasmine.createSpy();
    render(
      <MenuAdministracion
        rol="Administrador"
        vista="Productos"
        alCambiar={cambiar}
      />,
    );
    expect(
      screen
        .getByRole("button", { name: "Productos" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Órdenes" }));
    expect(cambiar).toHaveBeenCalledWith("Órdenes");
  });
});
