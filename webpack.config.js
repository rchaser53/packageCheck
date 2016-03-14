'use strict';

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // devtool: 'eval-source-map',
  // devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, './src/Studio.jsx')
  ],
  output: {
    path: path.join(__dirname, '/workplace/'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extenstions: ['', '.js','.jsx', '.json', '.html']
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  node:{
    fs:'empty',
    json:'empty',
    console:true
  },
  module: {
    loaders: [
    {
      test: /\.(ts|tsx)?$/,
      exclude: /node_modules/,
      loaders:['babel','ts']
    },
    {
      test: /\.(js|jsx)?$/,
      exclude: /node_modules/,
      loader: 'babel'
    },
    {
      test: /\.json?$/,
      loader: 'json'
    },
    {
        test:   /\.(png|gif|jpe?g|svg)$/i,
        loader: 'url',
        query: {
          limit: 10000
        }
    },
    {
      test: /\.scss$/,
      loaders: ["style", "css","sass"]
    }]
  }
};