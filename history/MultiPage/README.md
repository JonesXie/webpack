# webpack
学习webpack文件配置

## webpack 基本配置
1. webpack && webpack-cli
> 此安装包，安装webpack
2. webpack-dev-server
> 此安装包，安装webpack本地服务

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
      //3.多个代理到一个
      {
        context: ["/api", "/pps", "/login"],
        target: 'http://192.168.1.54:8001',
        changeOrigin: true,
        secure: false
      }
    }
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

