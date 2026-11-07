import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react/pure';
import FormularioTienda from '../../src/components/organisms/FormularioTienda.jsx';
describe('FormularioTienda',()=>{
 it('no envía credenciales inválidas',()=>{const enviar=jasmine.createSpy();const v=render(<FormularioTienda tipo="login" alEnviar={enviar}/>);fireEvent.submit(v.container.querySelector('form'));expect(enviar).not.toHaveBeenCalled();expect(screen.getByLabelText('Correo').getAttribute('aria-invalid')).toBe('true');});
 it('descarta la comuna al cambiar región',()=>{render(<FormularioTienda tipo="cuenta" inicial={{region:'Tarapacá',comuna:'Iquique'}}/>);fireEvent.change(screen.getByLabelText('Región'),{target:{value:'Ñuble'}});const c=screen.getByLabelText('Comuna');expect(c.value).toBe('');expect(c.textContent).toContain('Chillán');expect(c.textContent).not.toContain('Iquique');});
 it('ofrece el rol solo en administración',()=>{const v=render(<FormularioTienda tipo="cuenta"/>);expect(screen.queryByLabelText('Perfil')).toBeNull();v.rerender(<FormularioTienda tipo="cuenta" administrar/>);expect(screen.getByLabelText('Perfil').textContent).toContain('Vendedor');});
});
