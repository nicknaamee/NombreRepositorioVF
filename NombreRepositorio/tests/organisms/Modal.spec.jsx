import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import Modal from '../../src/components/organisms/Modal.jsx';

describe('Modal', () => {
it('refleja abierto y actualiza el contenido según el tipo', () => {
    const cerrar = jasmine.createSpy('cerrar');
    const vista = render(<Modal abierto={false} cerrar={cerrar} />);
    expect(vista.container.querySelector('.modal').classList.contains('is-active')).toBeFalse();
    vista.rerender(<Modal abierto tipo="contacto" cerrar={cerrar} />);
    expect(screen.getByRole('dialog', { name: '¡Formulario enviado!' }).classList.contains('is-active')).toBeTrue();
    vista.rerender(<Modal abierto tipo="advertencia" cerrar={cerrar} />);
    expect(screen.getByRole('dialog', { name: '¡Oye!' }).textContent).toContain('Sé amable con tus compañeros.');
    expect(screen.getByRole('img', { name: 'Advertencia' }).getAttribute('src')).toContain('shutterstock.com');
  });

  it('notifica el cierre desde botón, fondo y Escape', () => {
    const cerrar = jasmine.createSpy('cerrar');
    const { container } = render(<Modal abierto cerrar={cerrar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Entendido' }));
    fireEvent.click(container.querySelector('.modal-background'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(cerrar).toHaveBeenCalledTimes(3);
  });

  it('gestiona el foco y elimina el listener al desmontarse', () => {
    const anterior = document.createElement('button');
    anterior.dataset.fixtureExterno = 'true';
    document.body.appendChild(anterior);
    anterior.focus();
    const cerrar = jasmine.createSpy('cerrar');
    const vista = render(<Modal abierto cerrar={cerrar} />);
    const entendido = screen.getByRole('button', { name: 'Entendido' });
    expect(document.activeElement).toBe(entendido);
    anterior.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(entendido);
    vista.unmount();
    expect(document.activeElement).toBe(anterior);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(cerrar).not.toHaveBeenCalled();
  });
});
