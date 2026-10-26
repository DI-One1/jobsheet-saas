import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "src/generated/**",
      "prisma/**",
      "dist/**",
      "build/**",
      "public/**",
    ],
  },
];

export default eslintConfig;
