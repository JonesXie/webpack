const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //css打包插件
const TerserJSPlugin = require('terser-webpack-plugin'); //js压缩插件
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin") //css压缩插件
const CopyWebpackPlugin = require("copy-webpack-plugin")
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const glob = require('glob');

let setMAP = () => {
  const entry = {};
  const HtmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js"));
  entryFiles.forEach(v => {
    const Match = v.match(/src\/(.*)\/index\.js/);
    const pageName = Match && Match[1];
    entry[pageName] = v
    HtmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `./src/${pageName}/index.html`),
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
module.exports = {
  mode: "production",
  entry: entry,
  output: {
    filename: "static/js/[name]_[hash:8].js",
    path: path.resolve(__dirname, 'dist'),
    publicPath: "../"
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css', // 添加css/
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
      from: "./src/vendor",
      to: "static/vendor"
    }]),
    // new webpack.BannerPlugin("make 2019 by joannes")
  ].concat(HtmlWebpackPlugins),
  module: {
    rules: [
      //JS
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ["@babel/plugin-transform-runtime", {
                corejs: 3
              }],
              ["@babel/plugin-proposal-decorators", {
                "legacy": true
              }],
              ["@babel/plugin-proposal-class-properties", {
                "loose": true
              }]
            ]
          }
        },
        exclude: /node_modules/
      },
      //CSS
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require('autoprefixer')]
            }
          },
        ]
      },
      // photo
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        //当图片小于多少k时，转为base64，否则使用file-loader导出
        // use:'file-loader'
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024, //10k
            outputPath: "static/img/"
          }
        }
      },
      // html内文件(图片等)
      {
        test: /\.html$/,
        use: 'html-withimg-loader'
      },
      // 字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "static/fonts/",
            publicPath: "../fonts/"
          }
        },
      },
    ]
  }
}