import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve' //支持nodejs打包
import commonjs from '@rollup/plugin-commonjs';
import externals from 'rollup-plugin-node-externals' //rollup自动识别外部依赖
import json from '@rollup/plugin-json' // 支持rollup打包nodejs模块
import terser from '@rollup/plugin-terser' //打包压缩代码
import typescript from 'rollup-plugin-typescript2' //打包ts文件
export default defineConfig([
  {
    input: {
      index: 'src/index.ts', // 打包入口文件
    },
    output: [
      {
        dir: 'dist', //输出目标文件夹
        format: 'cjs', //打包格式 commonjs规范
      },
    ],
    plugins: [
      nodeResolve(),
      externals({
        devDeps: false, // 可以识别我们package.jsond的Dependencies当作外依赖处理，不会引用其中引用的方法打包出来
      }),
      typescript(),
      json(),
      commonjs(),
      terser(),
    ],
  },
])
