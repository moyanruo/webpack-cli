const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const ExtractWebpackPlugin = require('extract-text-webpack-plugin')
// webpack 4.x 使用 MiniCssExtractPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const glob = require('glob')

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
	// 入口 entry
	entry: {
		app: './src/index.js',
		// 单独打包 jquery 文件
		jquery: 'jquery'
	},
	// 出口 output
	output: {
		// path: 绝对路径 __dirname: 项目绝对路径 path.resolve() 合并路径
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: [
					'babel-loader'
				],
				// 不包括 node_modules 文件夹中 js
				exclude: '/node_modules/'
			},
			{
				test: /\.(css|scss|sass)$/,
				/* use: ExtractWebpackPlugin.extract({
					fallback:'style-loader',
					use: 'css-loader',
					publicPath: '../'
				}) */
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../'
						}
					},
					'css-loader',
					'sass-loader',
					// css 自动添加前缀
					'postcss-loader'
				]
			},
			{
				test: /\.(png|jpg|git|svg|ico)$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 50,
						outputPath: 'images'
					}
				}]
			}
			// <%= htmlWebpackPlugin.options.title %> 不能并存使用
			/* {
				test: /\.html$/,
				use: [{
					loader: 'html-loader',
					options: {
						minimize: true
					}
				}]
			} */
		]
	},
	// plugin 插件
	plugins: [
		// 热更新
		new webpack.HotModuleReplacementPlugin({

		}),
		// 清除插件
		new CleanWebpackPlugin([
			// 移除 dist 目录
			'dist'
		]),
		// 可以有多个 new HtmlWebpackPlugin({}),生成多个页面
		new HtmlWebpackPlugin({
			// 标题
			title: 'webpack-cli',
			// 模板文件
			template: './src/index.html',
			// 消除缓存
			hash: true,
			// 压缩输出
			minify: {
				// 压缩空白区域
				collapseWhitespace: true
			}
		}),
		// 文件分离
		// new ExtractWebpackPlugin('css/index.css')
		new MiniCssExtractPlugin({
			filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
			chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css'
		}),
		// 消除冗余 css
		new PurifyCSSPlugin({
			// Give paths to parse for rules. These should be absolute!
			// 扫描需要应用此规则的 html 文件 （删除无用的 css ）
			paths: glob.sync(path.join(__dirname, 'src/*.html')),
		}),
		// 静态资源输出配置
		new CopyWebpackPlugin([{
			from: path.resolve(__dirname, '../src/assets'),
			to: 'static'
		}]),
		// 配置全局 jQuery
		new webpack.ProvidePlugin({
			$: 'jquery'
		})
	],
	// 分割文件
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					chunks: 'initial',
					name: 'jquery',
					enforce: true
				}
			}
		}
	},
	// 开发服务配置
	devServer: {
		// 设置服务器访问的基本目录
		contentBase: path.resolve(__dirname, '../dist'),
		// 服务器ip地址
		host: '0.0.0.0',
		port: 8080,
		// 自动打开浏览器
		open: true,
		// 热更新
		hot: true
	}
}