const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config');
const compiler = webpack({ ...webpackConfig, mode: 'development' });

exports.dev = middleware(compiler, webpackConfig.devServer);
