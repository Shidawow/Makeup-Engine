import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/studio-browser-smoke.test.tsx'],
  },
});
