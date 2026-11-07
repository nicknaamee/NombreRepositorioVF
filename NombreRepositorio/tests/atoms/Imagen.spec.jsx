import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import Imagen from '../../src/components/atoms/Imagen.jsx';

describe('Imagen', () => {
it('conserva la ruta local y el texto alternativo recibidos', () => {
    render(<Imagen src="img/foca.jpeg" alt="Foca sonriente" />);
    expect(screen.getByRole('img', { name: 'Foca sonriente' }).getAttribute('src'))
      .toBe('img/foca.jpeg');
  });

  it('reenvía clases y dimensiones sin cambiar sus valores', () => {
    render(<Imagen src="img/foca.jpeg" alt="Foca" className="borde-curvo" width={100} height={80} />);
    const imagen = screen.getByRole('img');
    expect(imagen.classList.contains('borde-curvo')).toBeTrue();
    expect(imagen.getAttribute('width')).toBe('100');
    expect(imagen.getAttribute('height')).toBe('80');
  });

  it('actualiza la descripción al recibir nuevas props', () => {
    const vista = render(<Imagen src="img/foca.jpeg" alt="Primera descripción" />);
    vista.rerender(<Imagen src="img/foca.jpeg" alt="Descripción actualizada" />);
    expect(screen.queryByRole('img', { name: 'Primera descripción' })).toBeNull();
    expect(screen.getByRole('img', { name: 'Descripción actualizada' }).getAttribute('src'))
      .toBe('img/foca.jpeg');
  });
});
