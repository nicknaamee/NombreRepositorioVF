import React from "react";
import PlantillaPagina from "../templates/PlantillaPagina.jsx";
import Imagen from "../atoms/Imagen.jsx";

const notas = [
  {
    id: "foca",
    titulo: "La foca",
    imagen: "img/foca.jpeg",
    resumen: "Sigue en la página.",
    detalle:
      "La foca que estaba en Otra Pagina también tiene un lugar en la tienda. Su foto es uno de los pocos productos del catálogo. La imagen original sigue donde estaba.",
  },
  {
    id: "esqueleto",
    titulo: "gatokunfu",
    imagen: "https://i.pinimg.com/originals/b0/7c/cc/b07cccf8a15ecf462d917fc0636e1895.gif",
    resumen: "Sigue bailando.",
    detalle:
      "El esqueleto recibe a quienes entran a Inicio. Mientras revisas una pala o un pandaen la tienda, él sigue con lo suyo. Puedes volver a verlo en la portada.",
  },
];

export default function Informacion() {
  const queryParams = new URLSearchParams(location.search);
  const esBlog = queryParams.has("blog");
  const idNota = queryParams.get("blog");
  const seleccion = idNota ? notas.filter((n) => n.id === idNota) : notas;

  return (
    <PlantillaPagina titulo={esBlog ? "Blog" : "Nosotros"}>
      <main className="container my-5">
        {esBlog ? (
          // Vista del Blog: Centrado en una columna responsiva
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              {!seleccion.length && (
                <div className="alert alert-warning text-center" role="alert">
                  Nota inexistente.
                </div>
              )}
              
              {seleccion.map((n) => (
                <article key={n.id} className="card shadow-sm border-0 mb-4 p-4 text-center">
                  <figure className="mb-4 mx-auto">
                    <Imagen
                      src={n.imagen}
                      alt={n.titulo}
                      // Forzamos un tamaño máximo para que los GIFs no ocupen toda la pantalla en PC
                      className="rounded-3 shadow-sm img-fluid"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                    />
                  </figure>
                  <h2 className="h4 fw-bold mb-3">{n.titulo}</h2>
                  <p className="text-muted mb-4">{idNota ? n.detalle : n.resumen}</p>
                  
                  <a 
                    href={idNota ? "info.html?blog=" : "info.html?blog=" + n.id}
                    className="btn btn-outline-primary rounded-pill fw-bold px-4 mx-auto"
                  >
                    {idNota ? "← Volver al blog" : "Leer nota"}
                  </a>
                </article>
              ))}
            </div>
          </div>
        ) : (
          // Vista de "Nosotros": Tarjeta corporativa elegante
          <section className="card shadow-sm p-5 border-0 text-center mx-auto" style={{ maxWidth: "600px" }}>
            <h2 className="h3 fw-bold mb-4">
              <span className="text-primary me-2" aria-hidden="true">◻</span>
              Subdirección del kizazo
            </h2>
            <p className="lead mb-4 text-dark">
              Una página con una foca, un buzón y una tienda pequeña.
            </p>
            <div className="bg-light p-3 rounded-3 border">
              <p className="mb-0 fw-medium text-muted">
                Proyecto de <strong className="text-dark">Paola Fuentes</strong>, <strong className="text-dark">Leandro Araya</strong> y <strong className="text-dark">Nicolás Poblete</strong>.
              </p>
            </div>
          </section>
        )}
      </main>
    </PlantillaPagina>
  );
}