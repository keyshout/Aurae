import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['index.ts', 'components/**/*.tsx', 'hooks/**/*.ts', 'lib/**/*.ts'],
    format: ['esm', 'cjs'],
    dts: false,
    bundle: false,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom', 'framer-motion'],
    treeshake: true
})
