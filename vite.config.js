import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          const modulePath = id.toString();
          const parts = modulePath.split('node_modules/')[1].split('/');
          const rootPackage = parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];

          if (rootPackage === 'firebase' && parts.length > 1) {
            return `vendor_firebase_${parts[1].replace('@', '').replace('/', '_')}`;
          }

          if (rootPackage === 'react-dom' && parts.length > 1) {
            return `vendor_react-dom_${parts[1].replace('@', '').replace('/', '_')}`;
          }

          return `vendor_${rootPackage.replace('@', '').replace('/', '_')}`;
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
