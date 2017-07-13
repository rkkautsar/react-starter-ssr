/* eslint-disable */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/server/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'server.bundle.js',
  },

  target: 'node',
  node: {
    __filename: true,
    __dirname: true,
  },

  // keep node_module paths out of the bundle
  externals: fs
    .readdirSync(path.resolve(__dirname, 'node_modules'))
    .concat(['react-dom/server', 'react/addons'])
    .reduce(function(ext, mod) {
      ext[mod] = 'commonjs ' + mod;
      return ext;
    }, {}),

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
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
      { test: /\.css$/, use: ['ignore-loader'] },
    ],
  },

  resolve: {
    alias: {
      app: path.resolve(__dirname, './src/app'),
      server: path.resolve(__dirname, './src/server'),
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.REACT_SPINKIT_NO_STYLES': true,
      __DEVELOPMENT__: process.env.NODE_ENV !== 'production',
      __SERVER__: true,
    }),
  ],
};
