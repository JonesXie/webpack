const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin")
const webpack = require('webpack')

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
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", path.resolve(__dirname, 'build')],
    }),
    new CopyWebpackPlugin([{
      from: "./src/vendor",
      to: "vendor"
    }]),
    new webpack.BannerPlugin('make 2019 by joannes'),
    //设置环境变量
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