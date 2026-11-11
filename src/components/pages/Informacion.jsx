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
    titulo: "El esqueleto",
    imagen: "https://media1.tenor.com/m/YB3M7ApTeMkAAAAd/skeleton-dance.gif",
    resumen: "Sigue bailando.",
    detalle:
      "El esqueleto recibe a quienes entran a Inicio. Mientras revisas una caja o una hoja en la tienda, él sigue con lo suyo. Puedes volver a verlo en la portada.",
  },
];
export default function Informacion() {
  const q = new URLSearchParams(location.search),
    blog = q.has("blog"),
    id = q.get("blog"),
    seleccion = id ? notas.filter((n) => n.id === id) : notas;
  return (
    <PlantillaPagina titulo={blog ? "Blog" : "Nosotros"}>
      <main className="container is-max-tablet px-4 my-5 zona-estrecha">
        {blog ? (
          <>
            {!seleccion.length && <p>Nota inexistente.</p>}
            {seleccion.map((n) => (
              <article key={n.id} className="box">
                <Imagen
                  src={n.imagen}
                  alt={n.titulo}
                  className="foto-producto"
                />
                <h2 className="title is-5">{n.titulo}</h2>
                <p>{id ? n.detalle : n.resumen}</p>
                <a href={id ? "info.html?blog=" : "info.html?blog=" + n.id}>
                  {id ? "Volver al blog" : "Leer nota"}
                </a>
              </article>
            ))}
          </>
        ) : (
          <section className="box">
            <h2 className="title is-5">Subdirección del kizazo</h2>
            <p>Una página con una foca, un buzón y una tienda pequeña.</p>
            <p className="mt-3">
              Proyecto de Paola Fuentes, Leandro Araya y Nicolás Poblete.
            </p>
          </section>
        )}
      </main>
    </PlantillaPagina>
  );
}
