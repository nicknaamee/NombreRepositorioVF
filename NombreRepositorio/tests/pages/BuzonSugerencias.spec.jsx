import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import BuzonSugerencias from '../../src/components/pages/BuzonSugerencias.jsx';

describe('BuzonSugerencias', () => {
it('informa que el buzón está vacío cuando no hay mensajes', () => {
    render(<BuzonSugerencias />);
    expect(screen.getByRole('heading', { name: 'Buzón (Basurero)' }).tagName).toBe('H1');
    expect(screen.getByText('No hay sugerencias en el basurero aún.').textContent).toContain('No hay sugerencias');
  });

  it('carga los mensajes guardados y los presenta como texto seguro', () => {
    localStorage.getItem.and.returnValue(JSON.stringify(['Primera', '<b>Segunda</b>']));
    const { container } = render(<BuzonSugerencias />);
    expect(screen.getByText('🗑️ Primera').textContent).toContain('Primera');
    expect(screen.getByText('🗑️ <b>Segunda</b>').textContent).toContain('<b>Segunda</b>');
    expect(container.querySelector('#listaMensajes b')).toBeNull();
    expect(container.querySelector('#listaMensajes').children.length).toBe(2);
  });

  it('ofrece volver al inicio aunque el almacenamiento esté dañado', () => {
    localStorage.getItem.and.returnValue('JSON inválido');
    render(<BuzonSugerencias />);
    expect(screen.getByRole('link', { name: 'Volver al Inicio' }).getAttribute('href')).toBe('index.html');
    expect(screen.getByText('No hay sugerencias en el basurero aún.').textContent).toContain('No hay sugerencias');
  });
});
