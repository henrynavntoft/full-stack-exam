import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Makes `expect` globally available
    environment: 'jsdom', // Simulated DOM environment
  },
});