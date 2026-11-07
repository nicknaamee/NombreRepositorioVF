import { leerSugerencias, guardarSugerencia, tienePalabraMala } from '../../src/services/sugerencias.js';

describe('leerSugerencias', () => {
  it('devuelve un arreglo vacío cuando no hay datos', () => {
    expect(leerSugerencias()).toEqual([]);
    expect(localStorage.getItem).toHaveBeenCalledWith('misSugerencias');
  });
  it('tolera JSON inválido y valores que no son arreglos', () => {
    ['JSON inválido', '{"mensaje":"hola"}'].forEach(valor => {
      localStorage.getItem.and.returnValue(valor);
      expect(leerSugerencias()).toEqual([]);
    });
  });
  it('conserva solo los textos del arreglo almacenado', () => {
    localStorage.getItem.and.returnValue('["Hola",3,null,"Ayuda",{}]');
    expect(leerSugerencias()).toEqual(['Hola', 'Ayuda']);
  });
});

describe('guardarSugerencia', () => {
  it('crea la lista serializada con el primer mensaje', () => {
    guardarSugerencia('Primera');
    expect(localStorage.setItem).toHaveBeenCalledWith('misSugerencias', '["Primera"]');
  });
  it('conserva los mensajes anteriores al agregar uno', () => {
    localStorage.getItem.and.returnValue('["Anterior"]');
    guardarSugerencia('Nueva');
    expect(localStorage.setItem).toHaveBeenCalledWith('misSugerencias', '["Anterior","Nueva"]');
  });
  it('propaga un fallo de escritura sin fingir que se guardó', () => {
    localStorage.setItem.and.throwError('Cuota agotada');
    expect(() => guardarSugerencia('Texto')).toThrowError('Cuota agotada');
  });
});

describe('tienePalabraMala', () => {
  it('permite mensajes sin palabras prohibidas', () => {
    expect(tienePalabraMala('Agregar una sección de ayuda')).toBeFalse();
  });
  it('detecta una palabra prohibida aunque esté en mayúsculas', () => {
    expect(tienePalabraMala('Eres TONTO')).toBeTrue();
  });
  it('documenta la coincidencia por subcadena heredada del original', () => {
    // "trofeo" contiene "feo": este caso documenta una limitación conocida.
    expect(tienePalabraMala('trofeo')).toBeTrue();
  });
});
