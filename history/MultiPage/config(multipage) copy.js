const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: "development",
  devServer: {
    port: 8088,
    open: true,
    contentBase: "./dist" //指定本地服务文件夹
  },
  entry: {
    home: "./src/index.js",
    other: "./src/other.js"
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
      chunks: ['home'] //使用代码块
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: "other.html",
      chunks: ['other']
    })
  ]
}