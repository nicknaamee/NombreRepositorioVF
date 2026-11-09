import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import FormularioSugerencias from '../../src/components/organisms/FormularioSugerencias.jsx';

describe('FormularioSugerencias', () => {
it('rechaza un texto vacío o de espacios sin guardar ni abrir éxito', () => {
    const { container } = render(<FormularioSugerencias />);
    fireEvent.change(screen.getByLabelText('Aquí escribe tu sugerencia:'), { target: { value: '   ' } });
    fireEvent.submit(container.querySelector('form'));
    expect(screen.getByText('Error: introducir texto válido').style.display).toBe('block');
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(container.querySelector('#modalExito').classList.contains('is-active')).toBeFalse();
  });

  it('abre advertencia por contenido prohibido y conserva el texto al cerrarla', () => {
    const { container } = render(<FormularioSugerencias />);
    const campo = screen.getByLabelText('Aquí escribe tu sugerencia:');
    fireEvent.change(campo, { target: { value: 'TONTO' } });
    fireEvent.submit(container.querySelector('form'));
    const modal = screen.getByRole('dialog', { name: '¡Oye!' });
    expect(modal.classList.contains('is-active')).toBeTrue();
    expect(localStorage.setItem).not.toHaveBeenCalled();
    fireEvent.click(within(modal).getByRole('button', { name: 'Entendido' }));
    expect(modal.classList.contains('is-active')).toBeFalse();
    expect(campo.value).toBe('TONTO');
  });

  it('guarda una sugerencia válida, limpia el campo y permite cerrar el éxito', () => {
    const { container } = render(<FormularioSugerencias />);
    const campo = screen.getByLabelText('Aquí escribe tu sugerencia:');
    fireEvent.change(campo, { target: { value: 'Agregar ayuda' } });
    fireEvent.submit(container.querySelector('form'));
    expect(localStorage.setItem).toHaveBeenCalledWith('misSugerencias', '["Agregar ayuda"]');
    expect(campo.value).toBe('');
    const modal = screen.getByRole('dialog', { name: '¡Sugerencia enviada!' });
    expect(modal.classList.contains('is-active')).toBeTrue();
    fireEvent.click(within(modal).getByRole('button', { name: 'Entendido' }));
    expect(modal.classList.contains('is-active')).toBeFalse();
  });
});
