const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
// 开发环境
module.exports = smp.wrap(merge(common, {
  mode: 'development',
  entry: path.resolve(__dirname, "src"),
  devtool: "eval-cheap-module-source-map",
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
  devServer: {
    hot: true, //热更新
    open: false, // 是否打开默认浏览器
    historyApiFallback: true, // 当使用 [HTML5 History API] 时，任意的 `404` 响应被替代为 `index.html`
    port: 9000, // 启动的端口
    compress: true, // 是否开启代码压缩
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.html"),
    }),
  ],
}));
