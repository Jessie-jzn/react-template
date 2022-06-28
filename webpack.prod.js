const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin"); // webpack5自带，无需安装
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); //优化、压缩 CSS
const PurgeCSSPlugin = require("purgecss-webpack-plugin");
const glob = require("glob");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = merge(common, {
  mode: "production",
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash:8].js",
    clean: true, // 编译前清除目录
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        // exclude: [paths.css, /node_modules/],
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin(), // 打包体积分析
    new MiniCssExtractPlugin({
      // 提取 CSS
      filename: "[name].[chunkhash:8].css",
    }),
    new PurgeCSSPlugin({ // 去除无用的CSS代码
      paths: glob.sync(`${path.resolve(__dirname, "src")}`, {
        nodir: true,
      }),
    }),
  ],
  optimization: {
    runtimeChunk: true,// 运行时代码创建一个额外的 chunk，减少 entry chunk 体积，提高性能
    // js压缩
    minimizer: [
      new TerserPlugin({
        parallel: 4, // 使用多进程并发运行压缩以提高构建速度。
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new CssMinimizerPlugin({
        parallel: 4,
      }),
    ],
  },
});
