import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/lib/__tests__/**/*.test.ts', 'src/components/__tests__/**/*.test.tsx'],
    exclude: ['.trunk/**/*'],
    environment: 'jsdom',
  },
});