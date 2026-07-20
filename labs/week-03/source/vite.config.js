import { defineConfig } from 'vite';

const repositoryName = "engse203-student-labs-68543210007";

export default defineConfig({
  base: `/${repositoryName}/labs/week-03/`,
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});