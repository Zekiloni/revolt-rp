const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');


const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  output: {
    path: join(__dirname, '../../dist/packages/rage-client')
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: { 'util': false }
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: false,
            configFile: join(__dirname, 'tsconfig.app.json')
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new NxAppWebpackPlugin({
      compiler: 'tsc',
      main: './src/index.ts',
      tsConfig: './tsconfig.app.json',
      optimization: false,
      runtimeChunk: false,
      outputHashing: 'none',
      // fileReplacements: [
      //   {
      //     replace: 'packages/rage-client/src/environment/environment.ts',
      //     with: isProduction
      //       ? 'packages/rage-client/src/environment/environment.production.ts'
      //       : 'packages/rage-client/src/environment/environment.development.ts'
      //   }
      // ]
    })
  ]
};
