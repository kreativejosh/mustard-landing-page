import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "lib/brand/**",
      "public/**",
    ],
  },
  {
    rules: {
      // Brand renders are served as plain <img> so they are never resized or recompressed.
      "@next/next/no-img-element": "off",
    },
  },
  {
    // The Three.js scene library is plain JS; scene objects are untyped here.
    files: ["components/hero-canvas.tsx"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
];

export default eslintConfig;
