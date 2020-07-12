const path = require('path')

const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const ImportHttpWebpackPlugin = require('import-http/webpack')

const { analysis } = require('yargs').argv

const buildPath = ''

const webpackConfig = {
  mode: process.env.NODE_ENV,
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: buildPath + 'index.js',
    chunkFilename: buildPath + 'js/' + '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ImagePreview',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.js', '.vue', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/image/[name].[hash:4].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:4].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:4].[ext]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new UglifyJsPlugin(),
    new OptimizeCssAssetsPlugin(),
    new webpack.NamedModulesPlugin(),
    ...(analysis ? [new BundleAnalyzerPlugin()] : []),
    new ImportHttpWebpackPlugin()
  ]
}
module.exports = webpackConfig
