var path = require('path');

var configFilePath = path.resolve(__dirname, 'tsconfig.json');

var config = {
  mode: 'development',
  entry: [path.resolve(__dirname, './index.tsx')],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: { configFile: configFilePath },
          },
        ],
        exclude: /(node_modules|__tests__)/,
      },
    ],
  },
};

module.exports = config;
