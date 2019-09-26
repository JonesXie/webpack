# webpack
学习webpack文件配置

## webpack 基本配置

1. webpack && webpack-cli

> 安装：npm i webpack webpack-cli -D  
> 描述：webpack核心模块

2. webpack-dev-server

> 安装：npm i webpack-dev-server -D  
> 描述：此安装包，安装webpack本地服务

## Webpack Dev Server 本地服务

1. webpack-dev-server 基础配置

> 安装：npm i webpack-dev-server -D    
> 描述: 本地开发服务

```javascript
module.exports={
  devServer:{
    port:8088, //端口
    hot:true,//是否热更新
    // 服务器将从哪个目录去查找内容文件
    contentBase:path.resovle(__dirname,'dist'),
  }
}
``` 

2. webpack-dev-server 跨域代理

> 1、直接使用代理    
> 2、删除一些自定义的路径  
> 3、设置多个代理  
> 4、对https网址转发设置 secure:false  
> 5、自己设置mock数据(设置中间件), before()和after()

```javascript
module.exports={
  devSever:{
     // 1.直接使用后台接口名 后台：/api/user 请求: /api/user
    proxy:{
      "/api":"http://192.168.1.54:8001",
    }，

    // 2.自己添加“api”并删除  后台：/user 请求: /api/user
    proxy:{
      "/api":{
        target:"http://192.168.1.54:8001",
        pathRewrite:{ //重写路径，将“/api”删除
          "/api":""
        }
      },
    }

    //3.多个代理到一个
    proxy:[
      {
        context: ["/api", "/pps", "/login"],
        target: 'http://192.168.1.54:8001',
        changeOrigin: true,
        //如果需要转发的网站是支持 https 的，那么需要增加secure=false，来防止转发失败
        secure: false,
      }
    ],
  // 中间件
    before(app){
      app.get("/user",(req,res)=>{
        res.json({"name":"xie"})
      })
    }
  }
}
``` 

## html 处理

1. html-webpack-plugin 

>安装：npm i html-webpack-plugin -D  
>描述：此插件将html文件输出在输出文件夹中。主要参数[具体解释](https://www.jianshu.com/p/08a60756ffda)。

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin ")
module.exports={
  plugins:[
    new HtmlWebpackPlugin({
      // html模板,可以是 html, jade, ejs, hbs等，必须安装对应的 loader
      template:"./index.html" ,
      filename: "index.html",
      //生成一个icon图标
      favicon: "./favicon.ico",
      //hash值
      hash: true,
      // 使用的代码块，用于多文件打包
      chunks:["home","other"],
      //设置页面的title
      title: 'webpackdemo'
      //minify压缩
      minify: {
        //是否对大小写敏感，默认false
        caseSensitive: true,

        //是否简写boolean格式的属性
        //如：disabled="disabled" 简写为disabled  默认false
        collapseBooleanAttributes: true,

        //是否去除空格，默认false
        collapseWhitespace: true,

        //是否压缩html里的css（使用clean-css进行的压缩） 默认值false；
        minifyCSS: true,

        //是否压缩html里的js（使用uglify-js进行的压缩）
        minifyJS: true,

        //Prevents the escaping of the values of attributes
        preventAttributesEscaping: true,

        //是否移除属性的引号 默认false
        removeAttributeQuotes: true,

        //是否移除注释 默认false
        removeComments: true,

        //从脚本和样式删除的注释 默认false
        removeCommentsFromCDATA: true,

        //是否删除空属性，默认false
        removeEmptyAttributes: true,

        //  若开启此项，生成的html中没有 body 和 head，html也未闭合
        removeOptionalTags: false,

        //删除多余的属性
        removeRedundantAttributes: true,

        //删除script的类型属性
        //在h5下面script的type默认值：text/javascript 默认值false
        removeScriptTypeAttributes: true,

        //删除style的类型属性， type="text/css" 同上
        removeStyleLinkTypeAttributes: true,

        //使用短的文档类型，默认false
        useShortDoctype: true,
      }
    })
  ]
}
```

2. 使用模板引擎 ejs

>安装：npm i html-loader ejs ejs-html-laoder -D  
>描述：1、安装`html-loader` , 将html中的文件进行解析  
>2、安装`ejs、ejs-html-laoder`对ejs模板进行解析

```javascript 
//webpack.config.js
module.exports={
  plugins:[
    new HtmlWebpackPlugin({
      template: './index.ejs', // ejs模板
      filename: "index.html",
    }),
  ],
  module:{
    rules:[
      //处理ejs文件
      {
        test: /\.ejs$/,
        use: ['html-loader', 'ejs-html-loader', ]
      }
    ]
  }
}
```

3. 多页面处理 glob

>安装：npm i glob -D  
>描述：1、插件，匹配解析当前文档目录  
>2、**多页面DEMO：[MultipleDemo](https://github.com/JoannesXie/webpack/blob/master/history/MultiDemo/webpack.config.js)**

```javascript
const glob = require('glob'); 

let setMAP = () => {
  const entry = {}; 
  const HtmlWebpackPlugins = []; 
  //获取当前目录下匹配 "./src/*/index.js" 的文件目录
  const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js")); 
  entryFiles.forEach(v => {
    const Match = v.match(/src\/(.*)\/index\.js/);
    const pageName = Match && Match[1];
    entry[pageName] = v; //设置entry
    //设置多个html插件
    HtmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: v.replace('index.js', 'index.html'),
        filename: `${pageName}/${pageName}.html` ,
        chunks: [pageName],
        favicon: path.resolve(__dirname, "favicon.ico"), //生成一个icon图标
      })
    );
  })
  return {
    entry,
    HtmlWebpackPlugins
  }
}
const {entry, HtmlWebpackPlugins} = setMAP(); 

module.exports={
  entry:entry, 
  plugins:[....].contact(HtmlWebpackPlugins)
}
``` 

## css 处理

1. css-loader 

>安装：npm i css-loader -D  
>描述：此loader 对 css 中的 @import进行处理

```javascript
//js中内联处理
import css from 'css-loader!./css/index.css';
console.log(css);
```

2. mini-css-extract-plugin (常用)

>安装：npm i mini-css-extract-plugin -D  
>描述：1、插件, 将所有的css样式打包在一个文件中，通过 link引入。  
>2、在loader 中使用 `MiniCssExtractPlugin.loader`

3. style-loader (可选)

>安装：npm i style-loader -D  
>描述：1、此loader 将css插入到html中  
>2、与 `mini-css-extract-plugin` 不能共用

4. postcss-loader && autoprefixer 

>安装：npm i postcss-loader autoprefixer -D  
>描述：1、此插件和loader是自动给css样式添加浏览器前缀。  
> 2、在`webpack.config.js`中配置 引入 `autoprefixer`  
> 3、在`package.json`文件中配置。  
> 4、在根目录创建 `postcss.config.js` 文件。  
> 5、配置 `package.json` 中的`browserslist`来传递`autoprefixer`的参数。

```javascript
// package 内容
{
  ....
  "postcss": {
    "plugins": {
      "autoprefixer": {}
    }
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}

// postcss.config.js 内容
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

案例：

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 

module.exports={
  plugins:[
    new MiniCssExtractPlugin({
      filename: "main.[hash:8].css",
      // hash: true
    })
  ]
  module:{
    rules:[{
      test:/\.css$/,
      use:[
        MiniCssExtractPlugin.loader,
        "css-loader",
        {
          //也可以在package.json中引入autoprefixer插件
          loader: "postcss-loader",
          options: {
            plugins: [require('autoprefixer')({
              //传参，将覆盖package.json中的"browserslist"
              //并不推荐这样写。应写在package.json中"browserslist"
              overrideBrowserslist: ["last 2 version"]
            })]
          }
        },
      ]
    }]
  }
}
```

5. node-sass && sass-loader 、less && less-loader、stylus && stylus-loader

>安装：npm i node-sass sass-loader -D  
>描述：此loader 将scss/less/stylus 进行 =>css 处理

6. optimize-css-assets-webpack-plugin

>安装：npm i optimize-css-assets-webpack-plugin -D  
>描述：1、此插件是将css代码进行压缩。使用此插件，需要js插件进行js压缩。  
>2、在 `optimization` 中写。

```javascript
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  ```

## JS 处理

1. @babel/core

>安装：npm i @babel/core -D  
>描述：插件，将es语法转换为常用的js语法

2. babel-loader 

>安装：npm i babel-loader -D  
>描述：此loader 是 babel 转换的loader 

3. @babel/preset-env

>安装：npm i @babel/preset-env -D  
>描述：babel 预设环境

4. @babel/plugin-transform-runtime  &&  @babel/runtime(生产环境)

>安装：npm i @babel/plugin-transform-runtime -D  
>安装：npm i @babel/runtime -S  
>描述：1、babel插件 , ES代码装换时，可以重复使用Babel注入的帮助程序代码来节省代码。  
>2、对于实例方法，例如"foobar".includes("foo")只能使用core-js

5. @babel/runtime-corejs2 || @babel/runtime-corejs3 (生产环境)

>安装：npm i @babel/runtime-corejs2 -S  
>安装：npm i @babel/runtime-corejs3 -S  
>描述：补充对于实例方法的不支持

```javascript
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
    },
    env: { //根据不同环境配置不同不同参数
      production: {
        "presets": ["@babel/preset-env"]
      }
    }
  }],
  include: path.resolve(__dirname, 'src'), // 包含路径
  exclude: /node_modules/ // 排除路径
}
```

6. @babel/polyfill (生产环境)(babel7.4.0已废弃)(可使用corejs)

>安装：npm i @babel/polyfill -D  
>描述：babel插件 , 将实例方法进行解析，在babel7.4.0已废弃，可以使用第7条corejs

```javascript 
npm install --save @babel/polyfill
// 在index.js中引入即可
require("@babel/polyfill")
```

7. @babel/plugin-proposal-class-properties

>安装：npm i @babel/plugin-proposal-class-properties -D  
>描述：babel插件 , 对es 中 class 模块进行转换

8. @babel/plugin-proposal-decorators

>安装：npm i @babel/plugin-proposal-decorators -D  
>描述：babel插件 , 装饰器

```javascript 
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

9. eslint && eslint-loader

>安装：npm i eslint eslint-loader -D  
>描述：1、js校验。需要配置文件 `.eslintrc.json`  
>2、ESLint 的报错类型包括三种：`off、warn和error`，分别对应着：`0、1、2`  
>3、配置`.eslintrc.json`：[https://eslint.org/demo](https://eslint.org/demo)。  
>4、规则说明：[中文](https://cn.eslint.org/docs/rules/)、[英文](https://eslint.org/docs/rules/)。  
>5、腾讯 Alloy规则：[Github](https://github.com/AlloyTeam/eslint-config-alloy)  

```javascript
// .eslintrc.json
{
  "extends": ['alloy',], //使用自己安装的规则
  'rules': { //自己配置规则
      // 禁止 console，要用写 eslint disbale
      'no-console': 2,
      // 禁止 debugger，防止上线
      'no-debugger': 2,
  }
}

//webpack.config.js
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
// package.json
{
  "name":"",
  "eslintConfig": {
    "extends": [],
    "rules": {
      'no-console': 2,
    },
},
}
```

## 图片引入打包

1. `file-loader` (大图片,必须) && `url-loader`(图片转化base64)

> loader , 对于引入的文件处理

```javascript 
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

```javascript 
  import logo from "./logo.jpg"
  let img = new Image()
  img.src = logo;
 //或者 img.src = require('./logo.jpg');
  document.body.appendChild(img)
```

3. 使用css引入图片

>1、直接引入，因为css-loader会进行转换  
>2、css中使用 alias配置的参数，需要加上 `~` 

```javascript
 background:url('./logo.jpg')  => background:url(rquire('./logo.jpg'))
```

4. 使用html引入图片 `html-loader`

> 描述：1、loader，对html中的`外部资源(图片等)`进行转换  

```javascript
rules:[
  {
    test:/\.html$/,
    use:'html-loader'
  }
]
```
>3、`html`和`css`中使用 `alias`配置的参数，需要加上 `~`  
```javascript
// webpack.config.js
const path = require('path')
module.exports={
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}
//html 
<img src="~@/img/large.png" alt="背景图" />
//css
.bg-img {
    background: url(~@/img/small.png) no-repeat;
}
```

## 其他资源处理

1. 字体、富媒体

> 对于字体、富媒体等静态资源，可以直接使用`url-loader`或者`file-loader`进行配置即可

```javascript
{
    // 文件解析
    test: /\.(eot|woff|ttf|woff2|appcache|mp4|pdf)(\?|$)/,
    loader: 'file-loader',
    query: {
        // 这么多文件，ext不同，所以需要使用[ext]
        name: 'assets/[name].[hash:7].[ext]'
    }
},
``` 

## 打包文件分类

1. 设置全局路径 `publicPath`

> 对于引入的资源`(js, css, images等)`都将会自动加上 `publicPath`

```javascript
module.exports={
  output:{
    filename: "bunlde.[hash:8].js",
    path: path.resolve(__dirname, 'dist'), // 当前目录下的dist
    publicPath:'https://www.baidu.com'
  }
}
``` 

2. 设置css打包文件夹名

> 在 `MiniCssExtractPlugin` 插件中`filename`里加 `css/`

```javascript
module.exports={
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/main.[hash:8].css", // 添加css/
    })
  ], 
}
``` 

3. 设置图片打包文件夹名

>1、在 `url-laoder(file-loader)`中的`options`里设置  `outputPath`  
>2、也可以单独设置一个`publicPath`

```javascript
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

## webpack 小插件

1. clean-webpack-plugin 

>安装：npm i clean-webpack-plugin -D  
>描述：1、在打包时将之前的文件夹清理掉  
>2、[clean-webpack-plugin升级踩坑](https://juejin.im/post/5d81ff29e51d456212049230 "掘金")

```javascript
const {CleanWebpackPlugin} = require('clean-webpack-plugin') // 新版需要进行解构
module.exports={
  plugins: [
    new CleanWebpackPlugin() //默认不传参数，将会删除output指定的输出文件夹
    //传参
    new CleanWebpackPlugin({
      // 忽略掉不需要删除的文件，相当于exclude,被忽略的文件需要在开头加上 "!"号
      // 数组中必须带有"**/*"通配符,否则dist下的文件都不会被删除
      // 删除指定文件/文件夹 path.resolve(__dirname, 'test6')
      cleanOnceBeforeBuildPatterns: ["**/*", path.resolve(__dirname, 'build'),"!public"]
    })
  ]
}
``` 

2. copy-webpack-plugin 

>安装：npm i copy-webpack-plugin -D  
>描述：将文件拷贝到新的地方，通常用作将静态资源拷贝到dist文件夹中 

```javascript
const CopyWebpackPlugin = require("copy-webpack-plugin")
module.exports={
  plugins: [
    //里面放置数组，可以填写多个
    // 默认会放到output中指定的输出文件夹
    new CopyWebpackPlugin([{
      from: "./src/vendor",
      to: "vendor"
    }])
  ]
}
``` 

3. BannerPlugin  

> webpack自带插件，将每个问价中写入版权信息

```javascript
const webpack = require('webpack')
module.exports={
  plugins: [
    new webpack.BannerPlugin('make 2019 by joannes')
  ]
}
``` 

## resolve 参数

1. resolve.alias

> 常用，文件名缩写

```javascript
module.exports={
  resolve:{
    alias:{
      //解析路径
      "@":path.resolve(__dirname, 'src')
    }
  }
}
``` 

2. resolve.extensions

> 帮助 Webpack 解析扩展名的配置，默认值：`['.wasm', '.mjs', '.js', '.json']`

```javascript
module.exports = {
  resolve: {
      extensions: ['.js', '.json', '.css']
  }
}; 
``` 

3. 其他参数

```javascript
resolve.mainFields: 入口字段  
resolve.mainFiles：解析目录时候的默认文件名，默认是index，即查找目录下面的index+resolve.extensions文件  
resolve.modules：查找模块依赖时，默认是node_modules  
resolve.symlinks：是否解析符合链接（软连接，symlink）  
resolve.plugins：添加解析插件，数组格式  
resolve.cachePredicate：是否缓存，支持 boolean 和 function，function 传入一个带有 path 和 require 的对象，必须返回 boolean 值。 
```

## 区分不同环境

1. 设置环境变量， webpack.DefinePlugin

```javascript
  new webpack. DefinePlugin({
    ENV: JSON.stringify('dev')
  })
``` 

2. 设置不同开发环境config  webpack-merge

>安装：npm i webpack-merge -D  
>描述：1、安装 `webpack-merge`  
> 2、设置一个公共的参数，例如:`webpack.base.js`  
> 3、分别设置不同环境的参数，例如：`webapck.prod.js`,` webpack.dev.js`  
> 4、在不同的环境中引入公共参数和`webpakc-merge`  
> 5、在`package.json`中设置不同的启动命令

```javascript
//package.json
"scripts": {
  "build": "webpack  --progress --config webpack.prod.js", 
  "dev": "webpack-dev-server --progress  --config webpack.dev.js"
}
// webpack.prod.js
let {smart} = require('webpack-merge')
let base = require("./webpack.base.js")
module.exports = smart(base, {
  mode: "production", 
})
``` 

## 全局变量引入(jquery为例)

**默认已经通过npm安装了jQuery**

1. import $ from "jquery" 

> 在需要的js文件中直接引入, 但是不可以用 `window.$`

2. expose-loader (生产环境) 
>安装：npm i expose-loader -S  
>描述：1、暴露全局的loader  
>2、pre: 前置 , normal: 正常 , expose-loader: 内联 , post: 后置

```javascript 
//使用一：在文件中使用
import $ from "expose-loader?$!jquery"

//使用二：在webpack.config中配置
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

```javascript 
//在webpack.config中配置
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

```javascript 
module.exports={
  externals:{
    jquery:'$'
  }
}
```

## devtool 调试代码

1. source-map

> 源码映射，单独生成一个sourcemap文件，报错时会标识当前报错的列和行

```javascript
module.exports={
  entry:'', 
  devtool:"source-map"
}
``` 

2. eval-source-map

> 源码映射，不会产生单独文件，报错时会标识当前报错的列和行

```javascript
module.exports={
  entry:'', 
  devtool:"eval-source-map"
}
``` 

3. cheap-module-source-map

> 源码映射，单独生成一个sourcemap文件，报错时不会标识当前报错的列和行

```javascript
module.exports={
  entry:'', 
  devtool:"cheap-module-source-map"
}
``` 

4. cheap-module-eval-source-map

> 源码映射，不会产生单独文件，报错时不会标识当前报错的列和行

```javascript
module.exports={
  entry:'', 
  devtool:"cheap-module-eval-source-map"
}
``` 

## watch 实时监控打包

1. watch

> 将watch设置为 true时，将会实时监控文件

2. watchOptions

> 设置watch相关参数

```javascript
module.exports={
  entry:'', 
  watch:true, 
  watchOptions:{
    poll:1000, // 每秒问我 1000 次
    aggregateTimeout:500, // 防抖
    ingored: /node_modules/  //不需要监控的文件
  }
}
``` 

## webpack 优化

1. noParse  exclude  include

>1、`noParse` 不解析, 设置的文件  
>2、`exclude` 排除, 对设置的文件进行排除  
>3、`include` 包括, 只对设置的文件进行匹配

```javascript
module.exports={
  module:{
    noParse:/jquery/
    rules:[{
      test:/\.js$/,
      use:{
        loader:"babel-loader",
        options:{
          presets:["@babel/preset-env"]
        }
      },
      exclude:/node_modules/,
      include:path.resovle("src")
    }]
  }
}
``` 

2. IgnorePlugin 

> webpack自带插件，设置`忽略某项引入`

```javascript
  plugins: [
    //忽略引入 ./locale  在moment中
    new webpack.IgnorePlugin(/\.\/locale/,/moment/)
  ], 
  // 可以手动引入所需的语言包
  import "moment/locale/zh-cn"; 
  moment.locale("zh-cn"); 
``` 

3. happypack 

>安装：npm i happypack -D  
>描述：happypack插件 ，`多线程打包`

```javascript
const Happypack = require('happypack')
module.exports = {
  plugins: [
    new Happypack({
      id: 'js',
      use: [{
        loader: "babel-loader",
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            ["@babel/plugin-transform-runtime", {
              corejs: 3
            }]
          ]
        }
      }]
    })
  ], 
  module: {
    // css同样适用
    rules: [{
      test: /\.js$/,
      use: "Happypack/loader?id=js",
      exclude: /node_modules/
    }]
  }
}

``` 

4. webpack内置优化 

> 1、tree-shaking  
>>使用 import 导入时，在打包时会自动去除没用的代码  
>>require导入是放在一个对象中的，且不会去除代码, 在default中  

>2、scope-hosting   
>>作用域提升，打包时将多余的变量进行转化  

5. 代码分割 splitChunks

> 1、使用`optimization` 中的 `splitChunks`   
> 2、[详细解释地址](https://www.imooc.com/read/29/article/277 "慕课网")

```javascript
module.exports={
  optimization: {
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
}

``` 

6. @babel/plugin-syntax-dynamic-import  import按需懒加载

>安装：npm i @babel/plugin-syntax-dynamic-import -D  
>描述：`babel插件，需要写在babel中`

```javascript
// index.js
let button = document.createElement('button')
button.innerHTML = "name"
button.addEventListener('click', () => {
  import('./loader').then((data) => {
    console.log(data.default)
  })
})
document.body.appendChild(button)

//webpack.config.js
module.exports={
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
            }],
            //引入
            ['@babel/plugin-syntax-dynamic-import']
          ]
        }
      },
      exclude: /node_modules/
    }]
  }
}

``` 

7. 热更新  HotModuleReplacementPlugin

> webpack自带插件, 需要在本地服务启动 `hot:true`  

```javascript
module.exports={
  devSever:{
    hot:true
  }, 
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ], 
}
//index.js
import str from "./source"
if(module.hot){
  module.hot.accept('./source', ()=>{
    console.log("文件更新了")
  })
}
``` 