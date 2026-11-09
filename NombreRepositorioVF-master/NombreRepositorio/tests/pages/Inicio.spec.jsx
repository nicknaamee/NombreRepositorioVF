import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import Inicio from '../../src/components/pages/Inicio.jsx';

describe('Inicio', () => {
it('compone el título y la presentación originales', () => {
    render(<Inicio />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Título');
    expect(within(screen.getByRole('main')).getByText('Esta es una página web').textContent).toBe('Esta es una página web');
  });

  it('incluye el formulario de sugerencias dentro del contenido principal', () => {
    render(<Inicio />);
    const main = screen.getByRole('main');
    expect(within(main).getByLabelText('Aquí escribe tu sugerencia:').tagName).toBe('INPUT');
    expect(within(main).getByRole('button', { name: 'Enviar' }).type).toBe('submit');
  });

  it('ofrece el acceso flotante al buzón correcto', () => {
    render(<Inicio />);
    const acceso = screen.getByTitle('Ver basurero');
    expect(acceso.tagName).toBe('A');
    expect(acceso.getAttribute('href')).toBe('buzonsugerencias.html');
    expect(acceso.classList.contains('boton-flotante')).toBeTrue();
  });
});
