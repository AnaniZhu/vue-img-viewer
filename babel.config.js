
module.exports = {
  presets: [['@babel/preset-env', {
    targets: {
      'browsers': ['ie >= 10']
    }
  }]],
  plugins: [
    '@babel/plugin-transform-runtime'
  ]
}
