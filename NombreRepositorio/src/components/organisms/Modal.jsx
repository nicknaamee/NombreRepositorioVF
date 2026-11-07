import React from 'react';
import {useEffect,useRef} from 'react';
import Boton from '../atoms/Boton.jsx';
import Imagen from '../atoms/Imagen.jsx';
export default function Modal({tipo='sugerencia',abierto,cerrar}) {
 const boton=useRef(null);
 useEffect(()=>{if(!abierto)return; const previo=document.activeElement; boton.current?.focus(); const handler=e=>{if(e.key==='Escape')cerrar(); if(e.key==='Tab'){e.preventDefault();boton.current?.focus();}}; document.addEventListener('keydown',handler); return ()=>{document.removeEventListener('keydown',handler);previo?.focus();};},[abierto,cerrar]);
 const advertencia=tipo==='advertencia';
 return <div id={advertencia?'modalAdvertencia':'modalExito'} className={`modal ${abierto?'is-active':''}`} role="dialog" aria-modal="true" aria-labelledby={advertencia?'tituloAdvertencia':'tituloExito'}>
 <div className="modal-background" onClick={cerrar}/>
 <div className={`modal-content has-text-centered box caja-modal ${advertencia?'borde-advertencia':'borde-estandar'}`}>
 <figure className={`image is-inline-block mb-3 ${advertencia?'figura-responsiva':'gif-exito'}`}><Imagen src={advertencia?'https://www.shutterstock.com/image-photo/human-skeleton-death-smoking-cigarette-260nw-2206566039.jpg':'https://media1.tenor.com/m/587AABroBfwAAAAC/dance-skeleton.gif'} alt={advertencia?'Advertencia':'Éxito'} className={advertencia?'imagen-recortada':'borde-curvo'}/></figure>
 <h2 id={advertencia?'tituloAdvertencia':'tituloExito'} className={`title is-4 ${advertencia?'has-text-warning-dark':'has-text-success'}`}>{advertencia?'¡Oye!':tipo==='contacto'?'¡Formulario enviado!':'¡Sugerencia enviada!'}</h2>
 <p className={`mb-4 ${advertencia?'has-text-warning-dark':'has-text-success-dark'}`}>{advertencia?'¿Qué estás escribiendo? Sé amable con tus compañeros.':tipo==='contacto'?'Pronto nos pondremos en contacto.':'Tu mensaje ha sido enviado al basurero con éxito.'}</p>
 <Boton ref={boton} id={advertencia?'cerrarAdvertencia':'cerrarModal'} className={`${advertencia?'is-warning':'is-success'} is-outlined borde-curvo`} onClick={cerrar}>Entendido</Boton>
 </div></div>;
}
