import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// hansunmi.github.io 루트에 배포되므로, 앱은 /pixel-office/ 하위 경로로 빌드한다.
export default defineConfig({
  plugins: [react()],
  base: '/pixel-office/',
  build: {
    outDir: '../../pixel-office',
    emptyOutDir: true,
  },
});
