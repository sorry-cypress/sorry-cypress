const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';

module.exports = {
  entry: {
    main: ['./src/index.tsx'],
  },
  output: {
    publicPath: PUBLIC_PATH,
    jsonpScriptType: 'module',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.mjs',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      filename: 'views/index.ejs',
      inject: true,
      hash: true,
    }),
  ],
  devServer: {
    writeToDisk: true,
    host: '0.0.0.0',
  },
};
