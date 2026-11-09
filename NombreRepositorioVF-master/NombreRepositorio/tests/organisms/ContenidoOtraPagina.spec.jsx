import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import ContenidoOtraPagina from '../../src/components/organisms/ContenidoOtraPagina.jsx';

describe('ContenidoOtraPagina', () => {
it('conserva el título y las instrucciones de reproducción', () => {
    render(<ContenidoOtraPagina />);
    expect(screen.getByRole('heading', { name: 'Mira esta otra pagina u.u' }).tagName).toBe('H2');
    expect(screen.getByText('Reproduce el siguiente video sin salir de la pagina.').textContent).toContain('Reproduce');
  });

  it('configura el video original con título accesible y pantalla completa', () => {
    render(<ContenidoOtraPagina />);
    const video = screen.getByTitle('Video de YouTube Shorts');
    expect(video.getAttribute('src')).toBe('https://www.youtube.com/embed/ptWOsBkLj_E');
    expect(video.hasAttribute('allowfullscreen')).toBeTrue();
  });

  it('usa la foca local y conserva el texto que la acompaña', () => {
    render(<ContenidoOtraPagina />);
    expect(screen.getByRole('img', { name: 'Foca sonriente' }).getAttribute('src')).toBe('img/foca.jpeg');
    expect(screen.getByText('Mira esta imagen').parentElement.textContent).toContain('ahora tienes mas dopamina.');
  });
});
