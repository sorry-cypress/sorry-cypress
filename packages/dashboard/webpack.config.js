const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: ['./src/index.tsx']
  },
  output: {
    publicPath: '/',
    jsonpScriptType: 'module',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.mjs'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      inject: true
    })
  ],
  devServer: {
    host: '0.0.0.0',
    historyApiFallback: true,
    contentBase: [path.join(__dirname, 'static')]
  }
};
