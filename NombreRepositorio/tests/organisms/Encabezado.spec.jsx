import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import Encabezado from '../../src/components/organisms/Encabezado.jsx';

describe('Encabezado', () => {
it('utiliza el título original cuando no recibe uno', () => {
    render(<Encabezado />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Título');
  });

  it('muestra el título específico de la página', () => {
    render(<Encabezado titulo="Contacto" />);
    expect(screen.getByRole('heading', { name: 'Contacto', level: 1 }).textContent).toBe('Contacto');
  });

  it('actualiza el único encabezado al cambiar el título', () => {
    const vista = render(<Encabezado titulo="Inicio" />);
    vista.rerender(<Encabezado titulo="Contacto" />);
    expect(screen.getAllByRole('heading', { level: 1 }).length).toBe(1);
    expect(screen.queryByRole('heading', { name: 'Inicio' })).toBeNull();
    expect(screen.getByRole('banner').contains(screen.getByRole('heading'))).toBeTrue();
  });
});
