import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import PlantillaPagina from '../../src/components/templates/PlantillaPagina.jsx';

describe('PlantillaPagina', () => {
it('compone un encabezado, una navegación y un pie compartidos', () => {
    render(<PlantillaPagina><main>Contenido</main></PlantillaPagina>);
    expect(screen.getAllByRole('banner').length).toBe(1);
    expect(screen.getAllByRole('navigation').length).toBe(1);
    expect(screen.getAllByRole('contentinfo').length).toBe(1);
  });

  it('transmite el título de la página al encabezado', () => {
    render(<PlantillaPagina titulo="Contacto"><main>Contenido</main></PlantillaPagina>);
    expect(within(screen.getByRole('banner')).getByRole('heading', { level: 1 }).textContent).toBe('Contacto');
  });

  it('inserta children después de la navegación y antes del pie', () => {
    render(<PlantillaPagina><main>Contenido específico</main></PlantillaPagina>);
    const contenido = screen.getByRole('main');
    expect(contenido.textContent).toBe('Contenido específico');
    expect(Boolean(screen.getByRole('navigation').compareDocumentPosition(contenido) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTrue();
    expect(Boolean(contenido.compareDocumentPosition(screen.getByRole('contentinfo')) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTrue();
  });
});
