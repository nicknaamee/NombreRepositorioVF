import React, { useEffect, useRef } from 'react';
import Boton from '../atoms/Boton.jsx';
import Imagen from '../atoms/Imagen.jsx';

export default function Modal({ tipo = 'sugerencia', abierto, cerrar }) {
  const boton = useRef(null);

  // Mantenemos tu excelente lógica de accesibilidad (Focus trap y Escape key)
  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement;
    boton.current?.focus();
    
    const handler = (e) => {
      if (e.key === 'Escape') cerrar();
      if (e.key === 'Tab') {
        e.preventDefault();
        boton.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      previo?.focus();
    };
  }, [abierto, cerrar]);

  // Si no está abierto, no renderizamos nada, ahorrando memoria en el navegador
  if (!abierto) return null;

  // --- SEPARAMOS LA LÓGICA DEL DISEÑO ---
  const esAdvertencia = tipo === 'advertencia';
  const esContacto = tipo === 'contacto';

  const imgSrc = esAdvertencia 
    ? 'https://www.shutterstock.com/image-photo/human-skeleton-death-smoking-cigarette-260nw-2206566039.jpg' 
    : 'https://media1.tenor.com/m/587AABroBfwAAAAC/dance-skeleton.gif';
    
  const titulo = esAdvertencia ? '¡Oye!' : (esContacto ? '¡Formulario enviado!' : '¡Sugerencia enviada!');
  
  const mensaje = esAdvertencia 
    ? '¿Qué estás escribiendo? Sé amable con tus compañeros.' 
    : (esContacto ? 'Pronto nos pondremos en contacto.' : 'Tu mensaje ha sido enviado al basurero con éxito.');

  const colorClase = esAdvertencia ? 'text-danger' : 'text-success';
  const botonClase = esAdvertencia ? 'btn-outline-danger' : 'btn-outline-success';

  return (
    // Recreamos el Modal de Bootstrap manualmente para que funcione con tu estado de React
    <div 
      className="modal d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} // Fondo oscuro transparente
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-titulo"
    >
      {/* modal-dialog-centered lo alinea perfectamente al medio de la pantalla */}
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 text-center p-4">
          
          <figure className="mb-3 mx-auto" style={{ maxWidth: "200px" }}>
            <Imagen 
              src={imgSrc} 
              alt={esAdvertencia ? 'Advertencia' : 'Éxito'} 
              className="rounded-3 shadow-sm"
            />
          </figure>
          
          <h2 id="modal-titulo" className={`h4 fw-bold mb-3 ${colorClase}`}>
            {titulo}
          </h2>
          
          <p className="text-muted mb-4">
            {mensaje}
          </p>
          
          <Boton 
            ref={boton} 
            className={`${botonClase} rounded-pill fw-bold px-4 mx-auto`} 
            onClick={cerrar}
          >
            Entendido
          </Boton>
          
        </div>
      </div>
    </div>
  );
}