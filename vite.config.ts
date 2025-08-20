import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: [
      'chunk-DSFGRTI6',
      'chunk-PQUYVT7N',
      'chunk-HXLYD6SC',
      'chunk-LLJHJLFS',
      'chunk-S72ARCMP',
      'chunk-YXBH7WNX',
      'chunk-6PZAGMVY',
      'chunk-FNECWXOL',
      'chunk-SN5UUERH',
      'chunk-KYC7ZFSP',
      'chunk-TMVWB6QZ'
    ],
  },
}));
