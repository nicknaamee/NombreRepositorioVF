import React from 'react';
import PlantillaPagina from '../templates/PlantillaPagina.jsx';
import FormularioContacto from '../organisms/FormularioContacto.jsx';
export default function Contacto() { return (<PlantillaPagina titulo="Contacto"><main className="main"><section className="box mt-4 seccion-centrada"><article className="container"><div className="columns is-centered"><div className="column is-half"><FormularioContacto/></div></div></article></section></main></PlantillaPagina>); }
