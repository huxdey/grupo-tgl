import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Gera o site pronto na raiz do repositório, para hospedagem estática.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: '..', emptyOutDir: false, assetsDir: 'assets', chunkSizeWarningLimit: 800 }
})
