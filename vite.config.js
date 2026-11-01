import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
  const config = loadEnv(mode, process.cwd(), 'VITE_');
  if (config.VITE_SUPABASE_PUBLISHABLE_KEY && !config.VITE_SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_')) {
    throw new Error('The browser build only accepts a Supabase publishable key. Never use an administrative key.');
  }
  return {
  plugins: [react()],
  // Relative asset URLs support GitHub Pages repository subdirectories.
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  };
});
