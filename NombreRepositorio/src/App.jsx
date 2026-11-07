import Informacion from './components/pages/Informacion.jsx';
import Administracion from './components/pages/Administracion.jsx';
import Carrito from './components/pages/Carrito.jsx';
import Cuenta from './components/pages/Cuenta.jsx';
import Tienda from './components/pages/Tienda.jsx';
import React, { useEffect } from 'react';
import Inicio from './components/pages/Inicio.jsx';
import Contacto from './components/pages/Contacto.jsx';
import OtraPagina from './components/pages/OtraPagina.jsx';
import BuzonSugerencias from './components/pages/BuzonSugerencias.jsx';

export default function App() {
  // Leer la URL al renderizar permite montar App con distintas rutas en pruebas.
  const ruta = window.location.pathname.split('/').pop().toLowerCase();
  const buzon = ruta === 'buzonsugerencias.html';

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const claseHtmlAnterior = html.classList.contains('pagina-buzon');
    const claseBodyAnterior = body.classList.contains('p-5');
    html.classList.toggle('pagina-buzon', buzon);
    body.classList.toggle('p-5', buzon);
    return () => {
      html.classList.toggle('pagina-buzon', claseHtmlAnterior);
      body.classList.toggle('p-5', claseBodyAnterior);
    };
  }, [buzon]);

  if (ruta === 'tienda.html') return <Tienda />;
  if (ruta === 'cuenta.html') return <Cuenta />;
  if (ruta === 'carrito.html') return <Carrito />;
  if (ruta === 'admin.html') return <Administracion />;
  if (ruta === 'info.html') return <Informacion />;
  if (ruta === 'contacto.html') return <Contacto />;
  if (ruta === 'pag2.html') return <OtraPagina />;
  if (buzon) return <BuzonSugerencias />;
  return <Inicio />;
}
