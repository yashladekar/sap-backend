import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        index: "src/index.ts",
        roles: "src/roles.ts",
        permissions: "src/permissions.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    sourcemap: true,
});
