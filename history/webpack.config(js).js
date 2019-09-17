const path = require('path')

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bunlde.[hash:8].js",
    path: path.resolve(__dirname, 'dist'), // 当前目录下的dist
  },
  plugins: [], //插件，，数组格式
  module: {
    rules: [
      // //ESLINT  需要 .eslintrc.json 文件
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: "eslint-loader",
      //     options: {
      //       enforce: 'pre'  //pre:之前 , post:之后
      //     }
      //   }
      // },
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
            ]
          }
        }],
        include: path.resolve(__dirname, 'src'), // 包含路径
        exclude: /node_modules/ // 排除路径
      }
    ]
  }
}