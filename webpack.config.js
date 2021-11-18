const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = () => {
  const {
    npm_lifecycle_event: lifecycleEvent, // 返回当前正在运行的脚本名称，比如pretest、test、posttest等等
  } = process.env;
  const toRelease = /build/.test(lifecycleEvent); // 正式环境判断
  // == 变量
  const paths = {
    src: path.resolve(__dirname, "src"),
    html: path.resolve(__dirname, "src/index.html"),
    css: path.resolve(__dirname, "src/common/styles"),
    utils: path.resolve(__dirname, "src/common/utils/"),
    hooks: path.resolve(__dirname, "src/common/hooks/"),
    components: path.resolve(__dirname, "src/components"),
    dist: path.resolve(__dirname, "dist"),
  };
  // 公用基础配置
  const common = {
    // 入口
    entry: path.resolve(__dirname, "./src/index.js"),
    // 输出文件名
    output: {
      path: path.resolve(__dirname, "dist"), // 目标输出目录 path 的绝对路径
      filename: "bundle.[hash].js", // 用于输出文件的文件名
    },
    // 打包环境，默认开发
    mode: "development",
    // 模块
    module: {
      rules: [
        {
          test: /\.s?css$/,
          include: [paths.css, /node_modules/],
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg|mp3|mp4|mov|wav|wma|avi|flv)$/i,
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "[hash].[ext]",
          },
        },
        {
          test: /\.js$/,
          loader: "babel-loader", // 代码换成ES5 的代码来做浏览器兼容
          options: {
            presets: ["@babel/preset-env"],
            cacheDirectory: true, // 开启缓存
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["babel-loader", "ts-loader"],
        },
      ],
    },
    //插件
    plugins: [
      new HtmlWebpackPlugin({
        temeplate: path.html,
      }),
      new CleanWebpackPlugin(),
    ],
  };
  // 开发环境
  const development = {
    entry: ['react-hot-loader/patch', paths.src],
    optimization: {
      nodeEnv: "development",
      minimize: false,
    },
    devtool: "cheap-module-eval-source-map",
    devServer:{
        hot:true, //启用 webpack 的 热模块替换 特性
    }
  };
  return common;
};
