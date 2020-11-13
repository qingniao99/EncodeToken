import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel';

export default [{
  input: 'src/index.js',
  output: [{
    file: 'lib/index.js',
    format: 'cjs',
    name: 'EnToken',
    exports: 'named',
    strict: false
  },{
    file: 'lib/index.es.js',
    format: 'es',
    strict: false
  }],
  plugins: [
    commonjs(),
    resolve(),
    babel({
      runtimeHelpers: true   
    })
  ]
}];