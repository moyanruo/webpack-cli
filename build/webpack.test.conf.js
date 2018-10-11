const path = require('path')

module.exports = {
	// 入口 entry
	entry: {
		app: './src/index.js'
	},
	// 出口 output
	output: {
		// path: 绝对路径 __dirname: 项目绝对路径 path.resolve() 合并路径
		path: path.resolve(__dirname, '../dist'),
		filename: 'bundle.js'
	}
}