import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import OtraPagina from '../../src/components/pages/OtraPagina.jsx';

describe('OtraPagina', () => {
it('integra el contenido multimedia dentro de la plantilla compartida', () => {
    render(<OtraPagina />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Título');
    expect(within(screen.getByRole('main')).getByRole('heading', { level: 2 }).textContent).toBe('Mira esta otra pagina u.u');
    expect(screen.getByRole('contentinfo').textContent).toContain('Pie de página');
  });

  it('conserva las rutas para volver a Inicio o abrir Contacto', () => {
    render(<OtraPagina />);
    const nav = within(screen.getByRole('navigation'));
    expect(nav.getByRole('link', { name: 'Inicio' }).getAttribute('href')).toBe('index.html');
    expect(nav.getByRole('link', { name: 'Contacto' }).getAttribute('href')).toBe('contacto.html');
  });

  it('incluye un video y una imagen local sin formularios ajenos', () => {
    const { container } = render(<OtraPagina />);
    expect(within(screen.getByRole('main')).getByTitle('Video de YouTube Shorts').tagName).toBe('IFRAME');
    expect(screen.getByRole('img', { name: 'Foca sonriente' }).getAttribute('src')).toBe('img/foca.jpeg');
    expect(container.querySelector('form')).toBeNull();
  });
});
