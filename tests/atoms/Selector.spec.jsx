import React from "react";
import { render, screen, fireEvent } from "@testing-library/react/pure";
import Selector from "../../src/components/atoms/Selector.jsx";

describe("Selector", () => {
  it("muestra las opciones disponibles", () => {
    render(<Selector aria-label="Región" opciones={["Ñuble", "Tarapacá"]} />);
    expect(
      screen.getAllByRole("option").map((opcion) => opcion.textContent),
    ).toEqual(["Selecciona", "Ñuble", "Tarapacá"]);
  });
  it("comunica el valor seleccionado", () => {
    const cambiar = jasmine.createSpy();
    render(
      <Selector
        aria-label="Región"
        opciones={["Ñuble"]}
        onChange={(evento) => cambiar(evento.target.value)}
      />,
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Ñuble" },
    });
    expect(cambiar).toHaveBeenCalledWith("Ñuble");
  });
  it("permite deshabilitar el control", () => {
    render(<Selector aria-label="Región" disabled />);
    expect(screen.getByRole("combobox").disabled).toBeTrue();
  });
});
