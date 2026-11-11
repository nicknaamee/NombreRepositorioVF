import React from "react";
import { render, screen } from "@testing-library/react/pure";
import CampoSeleccion from "../../src/components/molecules/CampoSeleccion.jsx";

describe("CampoSeleccion", () => {
  it("asocia la etiqueta al selector", () => {
    render(<CampoSeleccion id="region" etiqueta="Región" />);
    expect(screen.getByLabelText("Región").tagName).toBe("SELECT");
  });
  it("vincula el error con el campo inválido", () => {
    render(
      <CampoSeleccion
        id="region"
        etiqueta="Región"
        error="Selecciona una región."
      />,
    );
    const campo = screen.getByLabelText("Región");
    expect(campo.getAttribute("aria-invalid")).toBe("true");
    expect(
      document.getElementById(campo.getAttribute("aria-describedby"))
        .textContent,
    ).toBe("Selecciona una región.");
  });
  it("actualiza las opciones al cambiar los datos", () => {
    const vista = render(
      <CampoSeleccion id="comuna" etiqueta="Comuna" opciones={["Iquique"]} />,
    );
    vista.rerender(
      <CampoSeleccion id="comuna" etiqueta="Comuna" opciones={["Chillán"]} />,
    );
    expect(screen.queryByRole("option", { name: "Iquique" })).toBeNull();
    expect(screen.getByRole("option", { name: "Chillán" })).toBeTruthy();
  });
});
