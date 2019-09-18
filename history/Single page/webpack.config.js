const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') //html插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin") //css打包插件
const TerserJSPlugin = require('terser-webpack-plugin'); //js压缩插件
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin") //css压缩插件

module.exports = {
  optimization: { //优化项
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "bunlde.[hash:8].js",
    path: path.resolve(__dirname, 'dist'), // 当前目录下的dist
    // publicPath: 'https://www.baidu.com'
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
      filename: "css/main.[hash:8].css",
      // hash: true
    })
  ],
  module: {
    rules: [
      // 图片引入
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        //当图片小于多少k时，转为base64，否则使用file-loader导出
        // use:'file-loader'
        use: {
          loader: 'url-loader',
          options: {
            limit: 200 * 1024, //200k
            outputPath: "img/",
            // publicPath:"https://xxx.xie.com"
          }
        }
      },
      {
        test: /\.html$/,
        use: 'html-withimg-loader'
      },
      //babel 转换
      {
        test: /\.js$/,
        use: [{
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ["@babel/plugin-proposal-decorators", {
                "legacy": true
              }],
              ["@babel/plugin-proposal-class-properties", {
                "loose": true
              }],
              ['@babel/plugin-transform-runtime', {
                corejs: 3
              }]
            ],
          }
        }],
        include: path.resolve(__dirname, 'src'), // 包含路径
        exclude: /node_modules/ // 排除路径
      },
      {
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