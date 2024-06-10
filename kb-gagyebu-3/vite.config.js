import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {

      '@': path.resolve(__dirname, 'src'),
      '@fullcalendar/core': path.resolve(__dirname, 'node_modules/@fullcalendar/core'),
      '@fullcalendar/daygrid': path.resolve(__dirname, 'node_modules/@fullcalendar/daygrid'),
      '@fullcalendar/interaction': path.resolve(__dirname, 'node_modules/@fullcalendar/interaction')
    },
  },
});
