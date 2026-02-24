import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['components/**/*.tsx', 'hooks/**/*.ts', 'lib/**/*.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom', 'framer-motion'],
    treeshake: true,
    banner: {
        js: '"use client"'
    }
})
