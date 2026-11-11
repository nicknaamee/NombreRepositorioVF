import React from "react";
import Imagen from "../atoms/Imagen.jsx";
export default function ContenidoOtraPagina() {
  return (
    <main>
      <div className="has-text-centered titulo-otra-pagina">
        <h2 className="title is-4">Mira esta otra pagina u.u</h2>
      </div>

      <section className="mx-auto caja-contenido">
        <p className="mb-4 has-text-centered">
          Reproduce el siguiente video sin salir de la pagina.
        </p>
        <figure className="image is-16by9 mb-5">
          <iframe
            className="has-ratio"
            src="https://www.youtube.com/embed/ptWOsBkLj_E"
            title="Video de YouTube Shorts"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </figure>
        <article className="message is-dark mb-5">
          <div className="message-body">
            <strong>Mira esta imagen</strong> ahora tienes mas dopamina.
          </div>
        </article>
        <figure className="image">
          <Imagen
            src="img/foca.jpeg"
            alt="Foca sonriente"
            className="imagen-foca"
          />
        </figure>
      </section>
    </main>
  );
}
