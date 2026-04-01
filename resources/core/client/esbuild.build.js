import esbuild from 'esbuild';
import packageJson from './package.json' with { type: 'json' };
import esbuildPluginTsc from 'esbuild-plugin-tsc';

await esbuild.build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    target: 'esnext',
    format: 'esm',
    sourcemap: 'inline',
    keepNames: true,
    minify: false,
    plugins: [esbuildPluginTsc()],
    external: [...Object.keys(packageJson.dependencies), 'alt-client', 'natives'],
});
