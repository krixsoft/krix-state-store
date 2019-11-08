const path = require('path');

module.exports = {
  entry: `./src/index.ts`,
  output: {
    path: path.resolve(__dirname, `./dist`),
    filename: `krix.bundle.js`,
  },
  // target: 'node',
  devtool: `inline-source-map`,
  mode: `production`,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [ `ts-loader` ],
        exclude: /node_modules/,
      },
      {
        enforce: `pre`,
        test: /\.tsx?$/,
        loader: `eslint-loader`,
        options: {
          configFile: `./.eslintrc.json`,
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ `.ts`, `.tsx`, `.js` ],
  },
};
