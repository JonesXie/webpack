const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    })
  ],
  devtool: 'source-map',
  watch: true,
  watchOptions: {
    poll: 1000, // 每秒问我 1000 次
    aggregateTimeout: 500, // 防抖
    ignored: /node_modules/ //不需要监控的文件
  },
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