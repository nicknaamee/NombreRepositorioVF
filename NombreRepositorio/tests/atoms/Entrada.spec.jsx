import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import Entrada from '../../src/components/atoms/Entrada.jsx';

describe('Entrada', () => {
it('crea un input y reenvía atributos del campo', () => {
    render(<Entrada aria-label="Correo" type="email" placeholder="correo" />);
    const entrada = screen.getByRole('textbox', { name: 'Correo' });
    expect(entrada.tagName).toBe('INPUT');
    expect(entrada.type).toBe('email');
    expect(entrada.placeholder).toBe('correo');
    expect(entrada.classList.contains('input')).toBeTrue();
  });

  it('crea un textarea cuando se solicita multilinea', () => {
    render(<Entrada aria-label="Mensaje" multilinea rows={4} />);
    const entrada = screen.getByRole('textbox', { name: 'Mensaje' });
    expect(entrada.tagName).toBe('TEXTAREA');
    expect(entrada.rows).toBe(4);
    expect(entrada.classList.contains('textarea')).toBeTrue();
  });

  it('notifica el valor nuevo y acepta un valor controlado actualizado', () => {
    const valores = [];
    const cambiar = e => valores.push(e.target.value);
    const vista = render(<Entrada aria-label="Nombre" value="Ana" onChange={cambiar} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nicolás' } });
    expect(valores).toEqual(['Nicolás']);
    vista.rerender(<Entrada aria-label="Nombre" value="Nicolás" onChange={cambiar} />);
    expect(screen.getByRole('textbox').value).toBe('Nicolás');
  });
});
