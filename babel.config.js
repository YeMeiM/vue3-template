module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
        'es.promise',
        'es.symbol'
      ]
    }]
  ],
  "plugins": [
    "@vue/babel-plugin-jsx",
    "@babel/plugin-proposal-optional-chaining",
  ]
}
