/* eslint-disable @typescript-eslint/no-unsafe-call  */
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;
const path = require('path');

module.exports = {
  entry: `./src/index.ts`,
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, `./dist`),
    filename: `index.js`,
  },
  // target: 'node',
  mode: `production`,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: `ts-loader`,
        exclude: /node_modules/,
        options: {
          configFile: `tsconfig.prod.json`,
        },
      },
      {
        enforce: `pre`,
        test: /\.tsx?$/,
        loader: `eslint-loader`,
        options: {
          configFile: `./.eslintrc.js`,
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ `.ts`, `.tsx`, `.js` ],
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
        },
      }),
    ],
  },
};
