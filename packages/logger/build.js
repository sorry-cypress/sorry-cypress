const { build } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

build({
  entryPoints: ['./src/index.ts'],
  platform: 'node',
  outdir: 'dist',
  minify: true,
  bundle: true,
  sourcemap: true,
  watch: process.argv[2] === '--watch',
  plugins: [nodeExternalsPlugin()],
}).catch(() => process.exit(1));
