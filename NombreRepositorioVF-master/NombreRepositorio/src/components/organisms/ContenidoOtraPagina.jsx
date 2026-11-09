import React from 'react';
import Imagen from '../atoms/Imagen.jsx';

export default function ContenidoOtraPagina() { 
  return (
    <main className="container my-5">
      {/* Centramos el contenido en una columna que ocupa 8 de 12 espacios en PC */}
      <div className="row justify-content-center">
        <section className="col-12 col-md-8 col-lg-6">
          
          <div className="text-center mb-4">
            <h2 className="h3 fw-bold">Mira esta otra pagina u.u</h2>
            <p className="text-muted mt-2">Reproduce el siguiente video sin salir de la página.</p>
          </div>

          {/* Contenedor del Video Responsivo */}
          <div className="ratio ratio-16x9 mb-5 shadow-sm rounded overflow-hidden">
            <iframe 
              src="https://www.youtube.com/embed/dwA5wsy9WlE" 
              title="Video de YouTube Shorts" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>

          {/* Mensaje de dopamina */}
          <div className="alert alert-dark mb-4 shadow-sm border-0 bg-secondary text-white" role="alert">
            <strong className="me-2">Mira esta imagen.</strong> 
            Ahora tienes más dopamina 📈.
          </div>

          {/* Imagen de la Foca */}
          <figure className="text-center mb-0">
            <Imagen 
              src="img/foca.jpeg" 
              alt="Foca sonriente" 
              // Bootstrap hace el borde redondeado, la sombra y el responsive automáticamente
              className="img-fluid rounded-3 shadow" 
            />
          </figure>

        </section>
      </div>
    </main>
  ); 
}