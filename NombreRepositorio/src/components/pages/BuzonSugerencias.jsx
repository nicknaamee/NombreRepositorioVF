import React from 'react';
import {useState} from 'react';
import {leerSugerencias} from '../../services/sugerencias.js';
import TarjetaSugerencia from '../molecules/TarjetaSugerencia.jsx';
export default function BuzonSugerencias(){const [sugerencias]=useState(leerSugerencias);return <section className="box" style={{maxWidth:'600px',margin:'0 auto'}}><h1 className="title has-text-centered">Buzón (Basurero)</h1><div id="listaMensajes">{sugerencias.length===0?<p className="has-text-centered has-text-grey">No hay sugerencias en el basurero aún.</p>:sugerencias.map((texto,i)=><TarjetaSugerencia key={i} texto={texto}/>)}</div><div className="has-text-centered mt-5"><a href="index.html" className="button">Volver al Inicio</a></div></section>;}
