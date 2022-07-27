import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import del from "rollup-plugin-delete";
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from "@rollup/plugin-typescript";
import copy from 'rollup-plugin-copy';
import dts from "rollup-plugin-dts";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true
      },
      {
        file: packageJson.module,
        format: "es",
        sourcemap: true
      },
    ],
    plugins: [
      del({ targets: 'dist/*' }),
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      json(),
      postcss({
        minimize: true,
        modules: true,
        extensions: ['.css', '.scss']
      }),
      copy({
        targets: [
          {
            src: ["src/components/imgs/*"],
            dest: "./dist/imgs"
          },
          {
            src: ["src/components/utils/*"],
            dest: "./dist/utils"
          },
        ],
        verbose: true
      })
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/, 'react'],
  },
];