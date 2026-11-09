const fs = require('node:fs');
const path = require('node:path');

// Reporte por prueba, útil para presentar la evidencia sin depender de capturas.
function ReportePruebas() {
  let casos = [];
  this.onRunStart = () => { casos = []; };
  this.onSpecComplete = (browser, result) => {
    casos.push({
      suite: result.suite.join(' > '),
      prueba: result.description,
      resultado: result.skipped ? 'pendiente' : result.success ? 'correcta' : 'fallida',
      duracionMs: result.time,
      errores: result.log,
      navegador: browser.name,
    });
  };
  this.onRunComplete = (_browsers, result) => {
    const carpeta = path.join(__dirname, 'reports');
    fs.mkdirSync(carpeta, { recursive: true });
    fs.writeFileSync(path.join(carpeta, 'resultado-pruebas.json'), JSON.stringify({
      fecha: new Date().toISOString(),
      correctas: result.success,
      fallidas: result.failed,
      error: Boolean(result.error),
      casos,
    }, null, 2));
  };
}
ReportePruebas.$inject = [];

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      '.test-build/tests.css',
      '.test-build/tests.js',
      { pattern: 'public/img/foca.jpeg', included: false, served: true, watched: false },
    ],
    proxies: { '/img/': '/base/public/img/' },
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-jsdom-launcher',
      { 'reporter:reporte-pruebas': ['type', ReportePruebas] },
    ],
    browsers: ['ChromeHeadless'],
    reporters: ['progress', 'reporte-pruebas'],
    client: { jasmine: { random: true } },
    singleRun: true,
    autoWatch: false,
    browserNoActivityTimeout: 30000,
  });
};
