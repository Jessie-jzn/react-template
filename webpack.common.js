const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const chalk = require("chalk");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
// == 变量
const paths = {
  src: path.resolve(__dirname, "src"),
  html: path.resolve(__dirname, "src/index.html"),
  css: path.resolve(__dirname, "src/common/styles"),
  utils: path.resolve(__dirname, "src/common/utils/"),
  hooks: path.resolve(__dirname, "src/common/hooks/"),
  components: path.resolve(__dirname, "src/components"),
  vendor: "dist/vendor.*.js",
};
// 公用基础配置
module.exports = {
  // 入口
  entry: path.resolve(__dirname, "./src/index.js"),
  // 输出文件名
  output: {
    path: path.resolve(__dirname, "dist"), // 目标输出目录 path 的绝对路径
    filename: "[name].[contenthash:8].js", // 用于输出文件的文件名
  },
  // 路径别名
  resolve: {
    alias: {
      src: paths.src,
      utils: paths.utils,
      components: paths.components,
    },
    extensions: [".js,'.tsx"],
  },
  // 打包环境，默认开发
  mode: "development",
  // 模块
  module: {
    rules: [
      {
        test: /\.s?css$/,
        include: [paths.css, /node_modules/],
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["autoprefixer"],
              },
              execute: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp3|mp4|mov|wav|wma|avi|flv)$/i,
        type: "asset/inline",
        parser: {
          dataUrlCondition: {
            // 转换成data-uri的条件
            maxSize: 10 * 1024, // 10kb
          },
        },
        generator: {
          filename: "images/[hash][ext][query]", // 指定生成目录名称
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
      {
        test: /\.(js|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: [
          "babel-loader", // 代码换成ES5 的代码来做浏览器兼容
          "ts-loader",
        ],
      },
    ],
  },
  //插件
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: paths.html,
    }),
    new CleanWebpackPlugin(),
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
    }), // 进度条
  ],
};
