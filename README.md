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
> 主要参数说明 , [具体解释](https://www.jianshu.com/p/08a60756ffda)
```
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
      //minify压缩
      minify: {
        //是否对大小写敏感，默认false
        caseSensitive: true,

        //是否简写boolean格式的属性如：disabled="disabled" 简写为disabled  默认false
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

        //删除script的类型属性，在h5下面script的type默认值：text/javascript 默认值false
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

## css 处理
1. css-loader 
> 此loader 对 css 中的 @import进行处理
2. mini-css-extract-plugin (常用)
> 插件,将所有的css样式打包在一个文件中，通过 link引入。  
> 在loader 中使用 MiniCssExtractPlugin.loader

3. style-loader (可选)
> 此loader 将css插入到html中  
> 与  mini-css-extract-plugin 不能共用
4. autoprefixer && postcss-loader 
> 此插件和loader是自动给css样式添加浏览器前缀。  
> 1、在webpack.config.js中配置 引入 autoprefixer  
> 2、在package.json文件中配置。
> 3、或者在根目录创建 postcss.config.js 文件。  
> 4、配置 package.json 中的“browserslist”来传递autoprefixer的参数。

```
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
```
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
> 此loader 将scss/less/styl 进行 =>css 处理
6. optimize-css-assets-webpack-plugin
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

> 官网配置.eslintrc.json并下载：[https://eslint.org/demo](https://eslint.org/demo)。  
> 腾讯 Alloy规则：[Github](https://github.com/AlloyTeam/eslint-config-alloy)
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
1. file-loader (大图片,必须) && url-loader(图片转化base64)
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

## webpack 多页面案例
1. glob
> 插件，匹配解析当前文档目录  
```
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
        filename: `${pageName}/${pageName}.html`,
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
const {
  entry,
  HtmlWebpackPlugins
} = setMAP();

module.exports={
  entry:entry,
  plugins:[....].contact(HtmlWebpackPlugins)
}
```

## devtool 调试代码
1. source-map
> 源码映射，单独生成一个sourcemap文件，报错时会标识当前报错的列和行
```
module.exports={
  entry:'',
  devtool:"source-map"
}
```
2. eval-source-map
> 源码映射，不会产生单独文件，报错时会标识当前报错的列和行
```
module.exports={
  entry:'',
  devtool:"eval-source-map"
}
```
3. cheap-module-source-map
> 源码映射，单独生成一个sourcemap文件，报错时不会标识当前报错的列和行
```
module.exports={
  entry:'',
  devtool:"cheap-module-source-map"
}
```
4. cheap-module-eval-source-map
> 源码映射，不会产生单独文件，报错时不会标识当前报错的列和行
```
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
```
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

## webpack 小插件
1. clean-webpack-plugin 
> 在打包时将之前的文件夹清理掉  

> [clean-webpack-plugin升级踩坑](https://juejin.im/post/5d81ff29e51d456212049230)

```
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
> 将文件拷贝到新的地方，通常用作将静态资源拷贝到dist文件夹中 

```
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

```
const webpack = require('webpack')
module.exports={
  plugins: [
    new webpack.BannerPlugin('make 2019 by joannes')
  ]
}
```

## webpack 跨域
1. 使用proxy进行代理
> 在本地服务中启用devServer,并配置跨域代理
```
module.exports={
  devSever:{
    proxy:{
      // 1.直接使用后台接口名 后台：/api/user 请求: /api/user
      "/api":"http://192.168.1.54:8001",
      // 2.自己添加“api”并删除  后台：/user 请求: /api/user
      "/api":{
        target:"http://192.168.1.54:8001",
        pathRewrite:{ //重写路径，将“/api”删除
          "/api":""
        }
      },
    }，
    //3.多个代理到一个
    proxy:[
      {
        context: ["/api", "/pps", "/login"],
        target: 'http://192.168.1.54:8001',
        changeOrigin: true,
        secure: false
      }
    ]
  }
}
```
2. 使用devServer内置的方法模拟数据
> 不通过后台，在devServer中模拟数据
```
devServer:{
  before(app){
    app.get("/user",(req,res)=>{
      res.json({"name":"xie"})
    })
  }
}
```

## resolve 参数
1. resolve.alias
> 常用，文件名缩写
```
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
> 帮助 Webpack 解析扩展名的配置，默认值：['.wasm', '.mjs', '.js', '.json']
```
module.exports = {
  resolve: {
      extensions: ['.js', '.json', '.css']
  }
};
```
3. 其他参数
```
resolve.mainFields:入口字段
resolve.mainFiles：解析目录时候的默认文件名，默认是index，即查找目录下面的index+resolve.extensions文件；
resolve.modules：查找模块依赖时，默认是node_modules；
resolve.symlinks：是否解析符合链接（软连接，symlink）；
resolve.plugins：添加解析插件，数组格式；
resolve.cachePredicate：是否缓存，支持 boolean 和 function，function 传入一个带有 path 和 require 的对象，必须返回 boolean 值。
```

## 区分不同环境
1. 设置环境变量， webpack.DefinePlugin
```
  new webpack.DefinePlugin({
    ENV: JSON.stringify('dev')
  })
```
2. 设置不同开发环境config  webpack-merge
>1、安装 webpack-merge  
>2、设置一个公共的参数，例如:webpack.base.js  
>3、分别设置不同环境的参数，例如：webapck.prod.js,webpack.dev.js  
>4、在不同的环境中引入公共参数和webpakc-merge  
>5、在package.json中设置不同的启动命令
```
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

## webpack 优化
1. noParse  exclude  include
> noParse 不解析,设置的文件  
> exclude 排除,对设置的文件进行排除  
> include 包括,只对设置的文件进行匹配
```
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
> webpack自带插件，设置忽略某项引入
```
  plugins: [
    //忽略引入 ./locale  在moment中
    new webpack.IgnorePlugin(/\.\/locale/,/moment/)
  ],
  // 可以手动引入所需的语言包
  import "moment/locale/zh-cn";
  moment.locale("zh-cn");
```
3. happypack 
> happypack插件 ，多线程打包
```
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
> 使用 import 导入时，在打包时会自动去除没用的代码  
> require导入是放在一个对象中的，且不会去除代码,在default中  
> 2、scope-hosting 
> 作用域提升，打包时将多余的变量进行转化  

5. 代码分割 splitChunks
> 使用optimization 中的 splitChunks  
> [详细解释](https://www.imooc.com/read/29/article/277)
```
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
> babel插件，需要写在babel中
```
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
> webpack自带插件, 需要在本地服务启动 hot:true  
```
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
  module.hot.accept('./source',()=>{
    console.log("文件更新了")
  })
}
```
