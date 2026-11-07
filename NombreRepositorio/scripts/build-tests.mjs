import { build } from 'esbuild';
await build({
  entryPoints: ['tests/index.js'],
  bundle: true,
  platform: 'browser',
  format: 'iife',
  outfile: '.test-build/tests.js',
  sourcemap: 'inline',
  define: { 'process.env.NODE_ENV': '"test"' },
});
console.log('Pruebas y estilos preparados en .test-build/');
