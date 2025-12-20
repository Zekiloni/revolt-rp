const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/packages/rage-server')
  },
  resolve: {
    extensions: ['.ts', '.js'],
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
        exclude: [/node_modules/]
      }
    ]
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      generatePackageJson: true,
      tsConfig: './tsconfig.app.json',
      optimization: false,
      outputHashing: 'none',
      // optimization: process.env['NODE_ENV'] === 'production',
      // outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none'
    }),
  ],
};
