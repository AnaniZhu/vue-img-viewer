const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',

  entry: {
    app: path.join(__dirname, './app.js')
  },

  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    alias: require('yargs').argv.debug ? {
      'vue-img-viewer': path.join(__dirname, '..', 'src')
    } : {
      'vue-img-viewer': path.join(__dirname, '..', 'dist/index.js')
    },
    extensions: ['.js', '.vue']
  },

  devServer: {
    contentBase: path.join(__dirname, '__build__'),
    port: 9000,
    hot: true,
    clientLogLevel: 'none'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.(css|scss)$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        shared: {
          name: 'shared',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  },

  plugins: [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'examples/index.html'
    })
  ]
}
