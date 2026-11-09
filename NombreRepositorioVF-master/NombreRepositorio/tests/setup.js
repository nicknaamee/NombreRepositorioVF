import { cleanup } from '@testing-library/react/pure';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const rutaOriginal = window.location.pathname + window.location.search;
const claseHtmlOriginal = document.documentElement.className;
const claseBodyOriginal = document.body.className;

// Las pruebas no necesitan descargar imágenes externas ni abrir YouTube.
const politica = document.createElement('meta');
politica.httpEquiv = 'Content-Security-Policy';
politica.content = "img-src 'self' data:; frame-src 'none';";
document.head.appendChild(politica);

beforeEach(() => {
  const datos = new Map();
  spyOn(Storage.prototype, 'getItem').and.callFake(
    clave => datos.has(clave) ? datos.get(clave) : null
  );
  spyOn(Storage.prototype, 'setItem').and.callFake(
    (clave, valor) => datos.set(clave, String(valor))
  );
  // Simular Storage evita usar datos reales y aísla los casos entre sí.
});

afterEach(() => {
  cleanup();
  document.querySelectorAll('[data-fixture-externo]').forEach(nodo => nodo.remove());
  window.history.replaceState({}, '', rutaOriginal);
  document.documentElement.className = claseHtmlOriginal;
  document.body.className = claseBodyOriginal;
});
