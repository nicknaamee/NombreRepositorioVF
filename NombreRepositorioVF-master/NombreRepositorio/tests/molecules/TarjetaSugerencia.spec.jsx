import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import TarjetaSugerencia from '../../src/components/molecules/TarjetaSugerencia.jsx';

describe('TarjetaSugerencia', () => {
it('presenta el mensaje recibido en su tarjeta', () => {
    render(<TarjetaSugerencia texto="Agregar ayuda" />);
    expect(screen.getByText(/Agregar ayuda/).textContent).toBe('🗑️ Agregar ayuda');
  });

  it('presenta etiquetas introducidas como texto y no como HTML', () => {
    const texto = '<b>Mensaje literal</b>';
    const { container } = render(<TarjetaSugerencia texto={texto} />);
    expect(screen.getByText('🗑️ ' + texto).textContent).toContain(texto);
    expect(container.querySelector('b')).toBeNull();
  });

  it('reemplaza el mensaje visible al cambiar la prop texto', () => {
    const vista = render(<TarjetaSugerencia texto="Anterior" />);
    vista.rerender(<TarjetaSugerencia texto="Nuevo" />);
    expect(screen.queryByText('🗑️ Anterior')).toBeNull();
    expect(screen.getByText('🗑️ Nuevo').textContent).toContain('Nuevo');
  });
});
