if (!window.global || !window.global._babelPolyfill) {
  require('babel-polyfill');
  require('es6-promise').polyfill();
}