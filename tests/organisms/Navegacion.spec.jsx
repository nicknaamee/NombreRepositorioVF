import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react/pure";
import Navegacion from "../../src/components/organisms/Navegacion.jsx";

describe("Navegacion", () => {
  it("ofrece Inicio con el destino index.html", () => {
    render(<Navegacion />);
    expect(
      within(screen.getByRole("navigation"))
        .getByRole("link", { name: "Inicio" })
        .getAttribute("href"),
    ).toBe("index.html");
  });

  it("ofrece Contacto con el destino contacto.html", () => {
    render(<Navegacion />);
    expect(
      screen.getByRole("link", { name: "Contacto" }).getAttribute("href"),
    ).toBe("contacto.html");
  });

  it("ofrece Otra Pagina con la ruta normalizada en minúsculas", () => {
    render(<Navegacion />);
    expect(
      screen.getByRole("link", { name: "Otra Pagina" }).getAttribute("href"),
    ).toBe("pag2.html");
    expect(
      screen.getByRole("link", { name: "Tienda" }).getAttribute("href"),
    ).toBe("tienda.html");
  });
});
