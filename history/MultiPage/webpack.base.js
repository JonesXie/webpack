const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack")
module.exports = {
  entry: {
    home: "./src/index.js"
  },
  output: {
    //[name]对应入口的文件名
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: "index.html",
    }),
    new webpack.DefinePlugin({
      ENV: JSON.stringify('dev')
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            ["@babel/plugin-transform-runtime", {
              corejs: 3
            }]
          ]
        }
      },
      exclude: /node_modules/
    }]
  }
}