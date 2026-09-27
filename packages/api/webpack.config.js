const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/packages/api'),
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
      tsConfig: './tsconfig.app.json',
      generatePackageJson: true,
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
    }),
  ],
};
