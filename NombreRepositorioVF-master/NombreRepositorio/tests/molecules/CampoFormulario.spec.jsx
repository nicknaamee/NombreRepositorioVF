import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import CampoFormulario from '../../src/components/molecules/CampoFormulario.jsx';

describe('CampoFormulario', () => {
it('asocia la etiqueta con el control y asigna el nombre', () => {
    render(<CampoFormulario id="nombre" etiqueta="Nombre Completo:" />);
    const campo = screen.getByLabelText('Nombre Completo:');
    expect(campo.id).toBe('nombre');
    expect(campo.name).toBe('nombre');
    expect(campo.getAttribute('aria-invalid')).toBe('false');
  });

  it('muestra y asocia el error de validación al campo', () => {
    render(<CampoFormulario id="correo" etiqueta="Correo:" errorId="errorCorreo" error="Correo inválido" />);
    const campo = screen.getByLabelText('Correo:');
    expect(campo.getAttribute('aria-describedby')).toBe('errorCorreo');
    expect(campo.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Correo inválido').id).toBe('errorCorreo');
  });

  it('permite un campo multilinea y propaga sus cambios', () => {
    const valores = [];
    render(<CampoFormulario id="mensaje" etiqueta="Mensaje:" multilinea onChange={e => valores.push(e.target.value)} />);
    const campo = screen.getByLabelText('Mensaje:');
    expect(campo.tagName).toBe('TEXTAREA');
    fireEvent.change(campo, { target: { value: 'Consulta' } });
    expect(valores).toEqual(['Consulta']);
  });
});
