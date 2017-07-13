/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  entry: {
    main: ['babel-polyfill', './src/app/index.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: path.join('client', '[name].[hash].js'),
    hotUpdateChunkFilename: path.join('hot', '[id].[hash].hot-update.js'),
    hotUpdateMainFilename: path.join('hot', '[hash].hot-update.json'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              noquotes: true,
              limit: 8192,
              name: path.join('assets', '[name].[hash].[ext]'),
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|mp4|webm|eot|woff|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: path.join('assets', '[name].[hash].[ext]'),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
              },
            },
          ],
        }),
      },
    ],
  },

  resolve: {
    alias: {
      app: path.resolve(__dirname, './src/app'),
      server: path.resolve(__dirname, './src/server'),
    },
  },

  plugins: [
    new CleanWebpackPlugin([
      path.join('dist', 'client'),
      path.join('dist', 'assets'),
      path.join('dist', 'hot'),
    ]),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function(module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      __DEVELOPMENT__: process.env.NODE_ENV !== 'production',
      __SERVER__: false,
    }),
    new ExtractTextPlugin(path.join('client', 'styles_[contenthash].css')),
    new HtmlWebpackPlugin({
      filename: 'templates/index.ejs',
      template: 'raw-loader!src/server/templates/index.ejs',
      inject: true,
    }),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;
