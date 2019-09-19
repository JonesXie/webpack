const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack")
const Happypack = require('happypack')
module.exports = {
  mode: "development",
  devServer: {
    hot: true,
    open: true
  },
  optimization: {
    splitChunks: { //分割代码块
      cacheGroups: { // 缓存组
        common: { // 公共模块
          chunks: "initial",
          minSize: 0, //公用的大小
          minChunks: 2, //被用到的次数
        },
        vendor: { // 公用引入模块
          priority: 1, // 处理的优先级
          test: /node_modules/, //正则，/node_modules/里被引用的
          chunks: "initial",
          minSize: 0, //公用的大小
          minChunks: 2, //被用到的次数
        }
      }
    }
  },
  entry: {
    home: "./src/index.js",
    other: "./src/other.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: "index.html",
      chunks: ["home"]
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: "other.html",
      chunks: ["other"]
    }),
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),
    new Happypack({
      id: 'js',
      use: [{
        loader: "babel-loader",
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            ["@babel/plugin-transform-runtime", {
              corejs: 3
            }],
            ['@babel/plugin-syntax-dynamic-import']
          ]
        }
      }]
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [{
      test: /\.js$/,
      use: "Happypack/loader?id=js",
      exclude: /node_modules/
    }]
  }
}