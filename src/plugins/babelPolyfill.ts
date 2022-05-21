if (!window.global || !(window.global as any)._babelPolyfill) {
  require('babel-polyfill');
  require('es6-promise').polyfill();
}