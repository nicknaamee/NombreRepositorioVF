import React from 'react';
import {screen,fireEvent} from '@testing-library/react/pure';
import {montar,ruta} from '../tienda-util.jsx';
import Cuenta from '../../src/components/pages/Cuenta.jsx';
import {tiendaAPI} from '../../src/services/api.js';
describe('Cuenta',()=>{
 it('muestra el registro público sin selector de rol',()=>{ruta('/cuenta.html?registro=1');montar(<Cuenta/>);expect(screen.getByLabelText('RUN sin puntos ni guion')).toBeTruthy();expect(screen.queryByLabelText('Perfil')).toBeNull();});
 it('explica credenciales rechazadas',async()=>{ruta('/cuenta.html');spyOn(tiendaAPI,'pedir').and.rejectWith(Error('Credenciales inválidas'));const v=montar(<Cuenta/>);for(const [k,val] of [['Correo','a@gmail.com'],['Contraseña','1234']])fireEvent.change(screen.getByLabelText(k),{target:{value:val}});fireEvent.submit(v.container.querySelector('form'));expect(await screen.findByRole('alert')).toBeTruthy();});
 it('ofrece cerrar sesión al entrar con cuenta',()=>{montar(<Cuenta/>,{usuario:{nombre:'Ana',rol:'Cliente'}});expect(screen.getByRole('button',{name:'Cerrar sesión'})).toBeTruthy();expect(screen.queryByText('Abrir administración')).toBeNull();});
});
