# webpack
学习webpack文件配置

## html 处理
1. html-webpack-plugin 
> 此插件将html文件输出在输出文件夹中
## css 处理
1. css-loader 
> 此loader 对 css 中的 @import进行处理
2. style-loader (可选)
> 此loader 将css插入到html中
2. mini-css-extract-plugin (可选)
> 此插件将所有的css样式打包在一个文件中，通过 link引入。
> 在loader 中使用 MiniCssExtractPlugin.loader
3. node-sass && sass-loader 、less && less-loader、stylus && stylus-loader
> 此loader 将scss/less/styl 进行 =>css 处理
4. autoprefixer && postcss-loader 
> 此插件和loader是自动给css样式添加浏览器前缀。
> 需要 postcss.config.js 文件。

```
// postcss.config.js 内容
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```
5. optimize-css-assets-webpack-plugin
> 此插件是将css代码进行压缩。使用此插件，需要js插件进行js压缩。
> 在optimization 中写。
```
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  ```
## JS 处理
1. @babel/core
> 插件，将es语法转换为常用的js语法
2. babel-loader 
> 此loader 是 babel 转换的loader 
3. @babel/preset-env
> babel 预设环境
4. @babel/plugin-proposal-class-properties
> babel插件 , 对es 中 class 模块进行转换
5. @babel/plugin-proposal-decorators
> babel插件 , 装饰器
```
module: {
  rules: [
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
            }]
          ]
        }
      }]
    }
  ]
}
```
6. @babel/plugin-transform-runtime
> babel插件 , ES代码装换时，可以重复使用Babel注入的帮助程序代码来节省代码。

> 对于实例方法，例如"foobar".includes("foo")只能使用core-js

7. @babel/runtime-corejs2 || @babel/runtime-corejs3 (生产环境)
> 补充对于实例方法的不支持
```
["@babel/plugin-transform-runtime", {corejs: 3}]

//babel
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
```
8. @babel/runtime  (生产环境)
> babel插件 , 在生产环境中，重复使用babel注入的帮助程序代码

9. @babel/polyfill (生产环境)(babel7.4.0已废弃)(可使用corejs)
> babel插件 , 将实例方法进行解析，在babel7.4.0已废弃，可以使用第7条corejs
```
npm install --save @babel/polyfill
// 在index.js中引入即可
require("@babel/polyfill")
```
10. eslint && eslint-loader 
> loader , js校验。需要配置文件 " .eslintrc.json "

> 配置.eslintrc.json并下载：[https://eslint.org/demo](https://eslint.org/demo)。
```
module: {
  rules: [
    //ESLINT
    {
      test: /\.js$/,
      use: {
        loader: "eslint-loader",
        options: {
          enforce: 'pre'  //pre:之前 , post:之后
        }
      }
    }
  ]
}
```

## 全局变量引入(jquery为例)
默认已经通过npm安装了jQuery

1. @babel/core
> 插件，将es语法转换为常用的js语法
