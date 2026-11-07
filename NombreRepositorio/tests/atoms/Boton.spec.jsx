import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react/pure';
import Boton from '../../src/components/atoms/Boton.jsx';

describe('Boton', () => {
it('muestra el contenido recibido y conserva las clases base y adicionales', () => {
    render(<Boton className="is-success">Enviar</Boton>);
    const boton = screen.getByRole('button', { name: 'Enviar' });
    expect(boton.classList.contains('button')).toBeTrue();
    expect(boton.classList.contains('is-success')).toBeTrue();
  });

  it('ejecuta el callback recibido al hacer clic', () => {
    const pulsar = jasmine.createSpy('pulsar');
    render(<Boton onClick={pulsar}>Confirmar</Boton>);
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(pulsar).toHaveBeenCalledTimes(1);
  });

  it('reenvía disabled y type y no dispara el callback deshabilitado', () => {
    const pulsar = jasmine.createSpy('pulsar');
    render(<Boton disabled type="submit" onClick={pulsar}>Guardar</Boton>);
    const boton = screen.getByRole('button', { name: 'Guardar' });
    expect(boton.disabled).toBeTrue();
    expect(boton.type).toBe('submit');
    fireEvent.click(boton);
    expect(pulsar).not.toHaveBeenCalled();
  });
});
