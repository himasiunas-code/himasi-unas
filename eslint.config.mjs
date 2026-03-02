import { createRequire } from "module";

const require = createRequire(import.meta.url);

// eslint-config-next v15+ exports a native flat config array directly
const nextConfig = require("eslint-config-next");

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
