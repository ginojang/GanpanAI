import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/corpus': {
        target: 'http://ec2-43-203-248-68.ap-northeast-2.compute.amazonaws.com',
        changeOrigin: true,
      },
    },
  },
});