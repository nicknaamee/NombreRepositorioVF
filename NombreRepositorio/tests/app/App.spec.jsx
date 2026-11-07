import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import App from '../../src/App.jsx';

describe('App', () => {
it('elige la página correspondiente a cada ruta HTML existente', () => {
    const rutas = [
      ['index.html', 'Título'],
      ['contacto.html', 'Contacto'],
      ['pag2.html', 'Título'],
      ['buzonsugerencias.html', 'Buzón (Basurero)']
    ];
    rutas.forEach(([ruta, titulo]) => {
      window.history.replaceState({}, '', '/' + ruta);
      const vista = render(<App />);
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(titulo);
      if (ruta === 'pag2.html') expect(screen.getByTitle('Video de YouTube Shorts').tagName).toBe('IFRAME');
      if (ruta === 'index.html') expect(screen.getByText('Esta es una página web').textContent).toContain('página web');
      vista.unmount();
    });
  });

  it('normaliza mayúsculas y usa Inicio como alternativa de una ruta desconocida', () => {
    window.history.replaceState({}, '', '/CONTACTO.HTML');
    const vista = render(<App />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Contacto');
    window.history.replaceState({}, '', '/desconocida.html');
    vista.rerender(<App />);
    expect(screen.getByText('Esta es una página web').textContent).toContain('página web');
  });

  it('aplica las clases del buzón y las retira al cambiar de página', () => {
    window.history.replaceState({}, '', '/buzonsugerencias.html');
    const vista = render(<App />);
    expect(document.documentElement.classList.contains('pagina-buzon')).toBeTrue();
    expect(document.body.classList.contains('p-5')).toBeTrue();
    window.history.replaceState({}, '', '/index.html');
    vista.rerender(<App />);
    expect(document.documentElement.classList.contains('pagina-buzon')).toBeFalse();
    expect(document.body.classList.contains('p-5')).toBeFalse();
    vista.unmount();
  });
});
