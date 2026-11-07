import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import PiePagina from '../../src/components/organisms/PiePagina.jsx';

describe('PiePagina', () => {
it('presenta el texto del pie dentro de su región semántica', () => {
    render(<PiePagina />);
    expect(within(screen.getByRole('contentinfo')).getByText('Pie de página').textContent).toBe('Pie de página');
  });

  it('conserva el año y el aviso de derechos del proyecto', () => {
    render(<PiePagina />);
    expect(screen.getByRole('contentinfo').textContent).toContain('© 2026 - Todos los derechos reservados |');
  });

  it('conserva el nombre de la organización destacado', () => {
    render(<PiePagina />);
    expect(screen.getByText('Subdirección del kizazo').tagName).toBe('STRONG');
  });
});
