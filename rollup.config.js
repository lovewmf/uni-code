import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2';
export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/code.js',
        name: 'code',
        format: 'umd'//amd,cjs,es,iife,umd
    },
    plugins: [
        babel({
          exclude: 'node_modules/**'
        }),
        uglify(),
        typescript()
    ]
};