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
3. autoprefixer && postcss-loader 
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
4. optimize-css-assets-webpack-plugin
> 此插件是将css代码进行压缩。使用此插件，需要js插件进行js压缩
> 在optimization 中写。
```
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  ```



