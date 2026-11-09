import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import Presentacion from '../../src/components/organisms/Presentacion.jsx';

describe('Presentacion', () => {
it('conserva el texto de presentación original', () => {
    render(<Presentacion />);
    expect(screen.getByText('Esta es una página web').textContent).toBe('Esta es una página web');
  });

  it('conserva el GIF y su texto alternativo originales', () => {
    render(<Presentacion />);
    expect(screen.getByRole('img', { name: 'mira como muevel eskeleto' }).getAttribute('src'))
      .toBe('https://media1.tenor.com/m/YB3M7ApTeMkAAAAd/skeleton-dance.gif');
  });

  it('mantiene la presentación centrada y el borde de la imagen', () => {
    const { container } = render(<Presentacion />);
    expect(container.firstElementChild.classList.contains('seccion-centrada')).toBeTrue();
    expect(container.firstElementChild.classList.contains('has-text-centered')).toBeTrue();
    expect(screen.getByRole('img').classList.contains('borde-curvo')).toBeTrue();
  });
});
