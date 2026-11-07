export function leerSugerencias() {try {const datos=JSON.parse(localStorage.getItem('misSugerencias')); return Array.isArray(datos)?datos.filter(x=>typeof x==='string'):[];} catch {return [];}}
export function guardarSugerencia(texto) {const lista=leerSugerencias(); lista.push(texto); localStorage.setItem('misSugerencias',JSON.stringify(lista));}
export function tienePalabraMala(texto) {return ['tonto','feo','malo','pesado','wea','guea','huea','mierda','mueranse','matense','malos'].some(p=>texto.toLowerCase().includes(p));}
