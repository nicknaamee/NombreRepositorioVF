import { defineConfig, loadEnv } from "vite";
import handler from "./api/index.js";
const montar = (server) => {
  server.middlewares.use("/api/index", handler);
};
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const k of [
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "TIENDA_DB",
  ])
    if (env[k] && !process.env[k]) process.env[k] = env[k];
  return {
    base: "./",
    plugins: [
      {
        name: "api-tienda",
        configureServer: montar,
        configurePreviewServer: montar,
      },
    ],
    build: {
      rollupOptions: {
        input: [
          "index",
          "contacto",
          "pag2",
          "buzonsugerencias",
          "tienda",
          "cuenta",
          "carrito",
          "admin",
          "info",
        ].map((x) => x + ".html"),
      },
    },
  };
});
