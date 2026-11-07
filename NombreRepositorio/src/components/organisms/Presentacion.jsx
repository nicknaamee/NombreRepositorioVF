import React from 'react';
import Imagen from '../atoms/Imagen.jsx';
export default function Presentacion() { return (<section className="box mt-4 has-text-centered seccion-centrada">
<p >Esta es una página web</p>
<figure className="image mt-4 is-inline-block">
<Imagen src="https://media1.tenor.com/m/YB3M7ApTeMkAAAAd/skeleton-dance.gif" alt="mira como muevel eskeleto" className="borde-curvo" />
</figure>
</section>); }
