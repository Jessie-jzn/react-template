const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

// 公用基础配置
module.exports = {
  // 入口
  entry: path.resolve(__dirname, './src/index.ts'),
  // 输出文件名
  output: {
    path: path.resolve(__dirname, 'dist'), // 目标输出目录 path 的绝对路径
    filename: '[name].[contenthash:8].js' // 用于输出文件的文件名
  },
  // 路径别名
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      utils: path.resolve(__dirname, 'src/common/utils/'),
      components: path.resolve(__dirname, 'src/components'),
      style: path.resolve(__dirname, 'src/common/style/')
    },
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  // 打包环境，默认开发
  mode: 'development',
  // 模块
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'postcss-loader',
          'sass-loader',
          {
            loader: 'css-loader',
            options: {
              // 启用/禁用@import规则进行处理，控制@import的解析，默认值为true
              import: true,
              // importLoaders 选项允许你配置在 css-loader 之前有多少 loader 应用于 @imported 资源与 CSS 模块/ICSS 导入。
              importLoaders: 1,
              // 启用/禁用css模块或者icss及其配置
              modules: {
                mode: 'icss',
                // 允许配置生成的本地标识符(ident)
                // 建议：开发环境使用 '[path][name]__[local]'  生产环境使用 '[hash:base64]'
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                // 允许为本地标识符名称重新定义基本的 loader 上下文。
                localIdentContext: path.resolve(__dirname, 'src')
              },
              sourceMap: true
            }
          },

          {
            loader: 'babel-plugin-react-css-modules',
            options: {
              context: path.join(__dirname, '.'),
              exclude: 'node_modules',
              filetypes: {
                '.scss': {
                  syntax: 'postcss-scss'
                }
              }
            }
          }
        ],
        // 注意，所有导入文件都会受到 tree shaking 的影响。
        // 这意味着，如果在项目中使用类似 css-loader 并 import 一个 CSS 文件，
        // 则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除：
        sideEffects: true
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp3|mp4|mov|wav|wma|avi|flv)$/i,
        type: 'asset/inline',
        parser: {
          dataUrlCondition: {
            // 转换成data-uri的条件
            maxSize: 10 * 1024 // 10kb
          }
        },
        generator: {
          filename: 'images/[hash][ext][query]' // 指定生成目录名称
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
        use: {
          // 当有设置cacheDirectory时，指定的目录将用来缓存 loader 的执行结果。
          loader: 'babel-loader?cacheDirectory',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            // 'transform-runtime' 插件告诉 Babel,要引用runtime来代替注入
            // 引入 @babel/plugin-transform-runtime 并且使所有辅助代码从这里引用。
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.(ts|tsx)$/,
        include: path.join(__dirname, 'src'),
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  },
  //插件
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new CleanWebpackPlugin(),
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
    }) // 进度条
  ]
}
