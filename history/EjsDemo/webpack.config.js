const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //css打包插件
const TerserJSPlugin = require('terser-webpack-plugin'); //js压缩插件
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin") //css压缩插件
const CopyWebpackPlugin = require("copy-webpack-plugin")
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
module.exports = {
  mode: "production",
  devServer: {
    open: true,
    hot: true,
    proxy: {
      // "/api": "http://192.168.1.54:8001",
      "/api": {
        target: "http://192.168.1.54:8001",
        pathRewrite: { //重写路径，将“/api”删除
          "/api": ""
        }
      },
    }
  },
  entry: "./src/index.js",
  output: {
    filename: "[name]_[hash:8].js",
    path: path.resolve(__dirname, "dist")
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.ejs',
      filename: "index.html",
      favicon: "./favicon.ico", //生成一个icon图标
      minify: {
        collapseWhitespace: true, //是否去除空格，默认false
      }
    }),
    new MiniCssExtractPlugin({
      filename: "css/main.[contenthash:8].css", // 添加css/
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
      from: "./src/vendor",
      to: "vendor"
    }]),
    new webpack.BannerPlugin("make 2019 by joannes")
  ],
  module: {
    rules: [
      //JS
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ["@babel/plugin-transform-runtime", {
                corejs: 3
              }],
              ["@babel/plugin-proposal-decorators", {
                "legacy": true
              }],
              ["@babel/plugin-proposal-class-properties", {
                "loose": true
              }]
            ]
          }
        },
        exclude: /node_modules/
      },
      //CSS
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require('autoprefixer')]
            }
          },
        ]
      },
      // photo
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        //当图片小于多少k时，转为base64，否则使用file-loader导出
        // use:'file-loader'
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024, //10k
            outputPath: "img/"
          }
        }
      },
      // html内文件
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      //处理ejs文件
      {
        test: /\.ejs$/,
        use: ['html-loader', 'ejs-html-loader', ]
      }
    ]
  }
}