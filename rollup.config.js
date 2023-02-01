import beep from "@rollup/plugin-beep";
import buble from "@rollup/plugin-buble";
import common from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import scss from "rollup-plugin-scss";
import vue from "rollup-plugin-vue";

import pkg from "./package.json" assert { type: "json" };

const banner = `/*
 * ${pkg.name}
 * ${pkg.description}
 * v${pkg.version}
 * ${pkg.license} License
 */
`;

export default {
  input: "src/vue-float-menu.js",
  output: [
    {
      file: pkg.main,
      format: "es",
      exports: "named",
      strict: true,
      banner,
    },
    // {
    //   file: pkg.module,
    //   format: "es",
    //   exports: "named",
    //   strict: true,
    //   banner,
    // },
    {
      file: pkg.umd,
      format: "umd",
      exports: "named",
      strict: true,
      banner,
      name: "FloatMenu",
      globals: {
        vue: "vue",
      },
    },
  ],
  plugins: [
    scss(),
    vue(),
    sucrase({
      exclude: ["node_modules/**"],
      transforms: ["typescript"],
    }),
    typescript(),
    beep(),
    common(),
    // buble(),
    resolve(),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    }),
  ],
  external: ["vue"],
};
