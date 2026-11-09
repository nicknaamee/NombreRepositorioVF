import React from 'react';
import {render} from '@testing-library/react/pure';
import {TiendaContext} from '../src/services/contexto.jsx';
import {iniciales} from '../src/services/semilla.js';
export function montar(ui,extra={}){
 const ctx={productos:iniciales,usuario:null,lineas:[],cargando:false,recargar:async()=>{},...extra};
 return render(<TiendaContext.Provider value={ctx}>{ui}</TiendaContext.Provider>);
}
export function ruta(s){window.history.replaceState({},'',s);}
