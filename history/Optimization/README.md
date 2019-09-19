# webpack
学习webpack文件配置

## webpack 基本配置
1. webpack && webpack-cli
> 此安装包，安装webpack
2. webpack-dev-server
> 此安装包，安装webpack本地服务

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

5. 代码分割
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
6. @babel/plugin-syntax-dynamic-import 懒加载
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
