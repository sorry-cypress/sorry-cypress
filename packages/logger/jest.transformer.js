const { default: bj } = require('babel-jest');
module.exports = bj.createTransformer({
  rootMode: 'upward',
});
