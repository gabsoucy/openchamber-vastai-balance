import { build } from "esbuild";

await build({
  entryPoints: ["src/main.ts"],
  outfile: "status/main.js",
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2022",
  minify: true,
  sourcemap: false,
});
