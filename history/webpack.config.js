const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') //html插件

module.exports = {
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
    })
  ],
  module: {
    rules: [{
        test: /\.css$/,
        use: [{
          loader: 'style-loader',
          options: {
            insert: 'head',
            injectType: 'singletonStyleTag'
          }
        }, {
          loader: 'css-loader',
          options: {
            modules: true
          }
        }]
      },
      {
        test: /\.scss$/,
        use: [{
            loader: 'style-loader',
            options: {
              insert: 'head',
              injectType: 'singletonStyleTag'
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          'sass-loader' // 把 scss => css
        ]
      }
    ]
  }
}