const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  mode: "production",
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
    new CleanWebpackPlugin(), //里面可以放数组，清除的文件夹
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