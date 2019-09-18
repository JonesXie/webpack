const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') //html插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin") //css打包插件
const TerserJSPlugin = require('terser-webpack-plugin'); //js压缩插件
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin") //css压缩插件

module.exports = {
  optimization: { //优化项
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    port: 2048,
    open: true,
    contentBase: "./dist" //指定本地服务文件夹
  },
  output: {
    filename: "bunlde.[hash:8].js",
    path: path.resolve(__dirname, 'dist'), // 当前目录下的dist
  },
  plugins: [ //插件，，数组格式
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      minify: {
        // collapseWhitespace: true, //一行显示
      },
      hash: true //hash值
    }),
    new MiniCssExtractPlugin({
      filename: "main.[hash:8].css",
      // hash: true
    })
  ],
  module: {
    rules: [{
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 使用 此插件loader替换 style-loader
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          "postcss-loader", // 使用 此loader自动给css添加浏览器样式
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // 使用 此插件loader替换 style-loader
          // {
          //   loader: 'style-loader',
          //   options: {
          //     insert: 'head',
          //     injectType: 'singletonStyleTag'
          //   }
          // },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          "postcss-loader", // 使用 此loader自动给css添加浏览器样式
          'sass-loader' // 把 scss => css
        ]
      }
    ]
  }
}