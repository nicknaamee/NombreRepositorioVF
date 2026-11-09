import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import Contacto from '../../src/components/pages/Contacto.jsx';

describe('Contacto', () => {
it('usa el título Contacto en la plantilla compartida', () => {
    render(<Contacto />);
    expect(within(screen.getByRole('banner')).getByRole('heading', { level: 1 }).textContent).toBe('Contacto');
    expect(screen.getByRole('contentinfo').textContent).toContain('Pie de página');
  });

  it('compone los cuatro controles etiquetados del formulario', () => {
    render(<Contacto />);
    const main = screen.getByRole('main');
    ['Nombre Completo:', 'Correo Electrónico:', 'Asunto:', 'Mensaje:'].forEach(etiqueta => {
      expect(within(main).getByLabelText(etiqueta).name).not.toBe('');
    });
    expect(within(main).getAllByRole('textbox').length).toBe(4);
  });

  it('mantiene la navegación de regreso a inicio y el envío como submit', () => {
    render(<Contacto />);
    expect(screen.getByRole('link', { name: 'Inicio' }).getAttribute('href')).toBe('index.html');
    const boton = screen.getByRole('button', { name: 'Enviar Mensaje' });
    expect(boton.type).toBe('submit');
    expect(boton.form.noValidate).toBeTrue();
  });
});
