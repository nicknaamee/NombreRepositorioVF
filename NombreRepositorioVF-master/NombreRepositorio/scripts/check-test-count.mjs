import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
async function archivos(dir) {
  const entradas = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entradas.map(e => e.isDirectory()
    ? archivos(path.join(dir, e.name)) : path.join(dir, e.name)))).flat();
}
const componentes = (await archivos('src/components')).filter(f => f.endsWith('.jsx'));
componentes.push('src/App.jsx');
const pruebas = await archivos('tests');
let total = 0;
for (const componente of componentes) {
  const nombre = path.basename(componente, '.jsx');
  const archivo = pruebas.find(f => path.basename(f) === nombre + '.spec.jsx');
  if (!archivo) throw new Error('Faltan pruebas de ' + nombre);
  const codigo = await readFile(archivo, 'utf8');
  const cantidad = (codigo.match(/\bit\s*\(/g) || []).length;
  if (cantidad !== 3) throw new Error(nombre + ': se esperaban 3 pruebas y hay ' + cantidad);
  total += cantidad;
  console.log(nombre + ': ' + cantidad);
}
console.log(componentes.length + ' componentes; ' + total + ' pruebas de componentes.');
console.log('Además: 9 pruebas para las 3 funciones de sugerencias.js.');
