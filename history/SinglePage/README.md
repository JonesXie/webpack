# webpack
学习webpack文件配置

## webpack 基本配置
1. webpack && webpack-cli
> 此安装包，安装webpack
2. webpack-dev-server
> 此安装包，安装webpack本地服务

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
4. @babel/plugin-transform-runtime  依赖安装  @babel/runtime
> babel插件 , ES代码装换时，可以重复使用Babel注入的帮助程序代码来节省代码。

> 对于实例方法，例如"foobar".includes("foo")只能使用core-js

5. @babel/runtime-corejs2 || @babel/runtime-corejs3 (生产环境)
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
6. @babel/runtime  (生产环境)
> babel插件 , 在生产环境中，重复使用babel注入的帮助程序代码

7. @babel/polyfill (生产环境)(babel7.4.0已废弃)(可使用corejs)
> babel插件 , 将实例方法进行解析，在babel7.4.0已废弃，可以使用第7条corejs
```
npm install --save @babel/polyfill
// 在index.js中引入即可
require("@babel/polyfill")
```
8. @babel/plugin-proposal-class-properties
> babel插件 , 对es 中 class 模块进行转换
9. @babel/plugin-proposal-decorators
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

1. import $ from "jquery" 
> 在需要的js文件中直接引入,但是不可以用 window.$

2. expose-loader (生产环境) 暴露全局的loader
> pre:前置 , normal:正常 , expose-loader:内联 , post:后置

```
使用一：在文件中使用
import $ from "expose-loader?$!jquery"

使用二：在webpack.config中配置
module:{
  rules:[
    {
      test:require.resovle('jquery'), //匹配引入jQuery
      user:"expose-loader?$"
    }
  ]
},
import $ from "jquery" 

```
3. webpack.ProvidePlugin  
> webpack自带插件，将 $ 注入到每个模块中
```
在webpack.config中配置
const webpack = require('webpack')
module.exports={
  plugins:[
   new webpack.ProvidePlguin({
     $:'jquery'
   })
  ]
}
```
4. externals 忽略引入
> 忽略引入，不进行打包, jquery已经通过cdn引入了
```
module.exports={
  externals:{
    jquery:'$'
  }
}
```

## 图片引入打包
1. file-loader (大图片) && url-loader(图片转化base64)
> loader , 对于引入的文件处理
```
module.exports={
  module:{
    rules:[
      {
        test:/\.(png|jpg|jpeg|gif)$/,
        //当图片小于多少k时，转为base64，否则使用file-loader导出
       // use:'file-loader'
       use:{
         loader:'url-loader',
         options:{
           limit:200*1024 //200k
         }
       }
      }
    ]
  }
}
```

2. 使用js引入图片
```
  import logo from "./logo.jpg"
  let img = new Image()
  img.src = logo;
 //或者 img.src = require('./logo.jpg');
  document.body.appendChild(img)
```
3. 使用css引入图片
> 直接引入，因为css-loader会进行转换

> background:url('./logo.jpg')  => background:url(rquire('./logo.jpg'))
4. 使用html引入图片 html-withimg-loader
> loader，将html中的图片进行转换
```
rules:[
  {
    test:/\.html$/,
    use:'html-withimg-loader'
  }
]
```

## 打包文件分类
1. 设置全局路径 publicPath
> 对于引入的资源(js,css,images等)都将会自动加上 publicPath
```
module.exports={
  output:{
    filename: "bunlde.[hash:8].js",
    path: path.resolve(__dirname, 'dist'), // 当前目录下的dist
    publicPath:'https://www.baidu.com'
  }
}
```

2. 设置css打包文件夹名
> 在 MiniCssExtractPlugin 插件中filename里加 css/
```
module.exports={
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/main.[hash:8].css", // 添加css/
      // hash: true
    })
  ],
}
```
3. 设置图片打包文件夹名
> 在 url-laoder(file-loader)中的options里设置  outputPath

> 也可以单独设置一个publicPath
```
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
  }
]
```