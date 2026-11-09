import React from 'react';
import Encabezado from '../organisms/Encabezado.jsx';
import Navegacion from '../organisms/Navegacion.jsx';
import PiePagina from '../organisms/PiePagina.jsx';
export default function PlantillaPagina({titulo,children}) { return <><Encabezado titulo={titulo}/><Navegacion/>{children}<PiePagina/></>; }
