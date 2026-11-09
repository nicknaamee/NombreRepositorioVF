import {tiendaAPI} from '../../src/services/api.js';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import FormularioContacto from '../../src/components/organisms/FormularioContacto.jsx';

describe('FormularioContacto', () => {
function llenar(correo) {
    const campos = { 'Nombre Completo:': 'Nicolás Poblete', 'Correo Electrónico:': correo, 'Asunto:': 'Consulta', 'Mensaje:': 'Hola' };
    Object.entries(campos).forEach(([etiqueta, value]) => {
      fireEvent.change(screen.getByLabelText(etiqueta), { target: { value } });
    });
  }

  it('muestra los cuatro errores requeridos al enviar campos vacíos', () => {
    const { container } = render(<FormularioContacto />);
    fireEvent.submit(container.querySelector('form'));
    ['Por favor, ingresa tu nombre completo.', 'Por favor, ingresa tu correo electrónico.', 'Por favor, ingresa un asunto.', 'Por favor, ingresa tu mensaje.'].forEach(texto => {
      expect(screen.getByText(texto).textContent).toBe(texto);
    });
    expect(container.querySelector('#modalExito').classList.contains('is-active')).toBeFalse();
  });

  it('rechaza un correo sin arroba y conserva los datos para corregirlo', () => {
    const { container } = render(<FormularioContacto />);
    llenar('correo-invalido');
    fireEvent.submit(container.querySelector('form'));
    expect(screen.getByText(/Por favor, ingresa un correo válido/).textContent).toContain('correo válido');
    expect(screen.getByLabelText('Correo Electrónico:').value).toBe('correo-invalido');
    expect(container.querySelector('#modalExito').classList.contains('is-active')).toBeFalse();
  });

  it('confirma campos válidos, los limpia y permite cerrar el modal', async () => {
    const { container } = render(<FormularioContacto />);
    const api=spyOn(tiendaAPI,'pedir').and.resolveTo(true);
    llenar('correo@gmail.com');
    fireEvent.submit(container.querySelector('form'));
    await screen.findByRole('dialog',{name:'¡Formulario enviado!'});
    expect(api).toHaveBeenCalled();
    screen.getAllByRole('textbox').forEach(campo => expect(campo.value).toBe(''));
    const modal = screen.getByRole('dialog', { name: '¡Formulario enviado!' });
    expect(modal.classList.contains('is-active')).toBeTrue();
    fireEvent.click(within(modal).getByRole('button', { name: 'Entendido' }));
    expect(modal.classList.contains('is-active')).toBeFalse();
  });
});
