const path = require('path'); // node内置模块
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css样式
const OptimizeCss = require('optimize-css-assets-webpack-plugin'); //压缩css文件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //压缩js文件
module.exports = {
	optimization: {
		//优化项
		minimizer: [
			new OptimizeCss(), //优化css  值配置优化css，js是不会被压缩的。如果希望js也要被压缩，需要用到
			new UglifyJsPlugin({
				cache: true, //使用缓存
				parallel: true, //并发打包，一起压缩多个文件
				sourceMap: true //源码映射，比如es6转换成es5的时候，映射关系
			})
		]
	},
	devServer: {
		// 本地服务器配置
		port: 3000, //端口号
		open: true, //启动后自动打开页面
		progress: true //进度条
	},
	mode: 'production',
	entry: './src/js/index.js', // 打包入口文件
	output: {
		// 打包后的输出配置
		path: path.resolve(__dirname, 'dist'), // 输出目录的path需要是绝对路径，__dirname表示当前目录下，这里也可以不写。path.resolve方法可以把相对路径变为绝对路径
		filename: 'bundle.[hash:7].js' // 输出文件的名称
	},
	plugins: [
		new HtmlWebpackPlugin({
			// 处理html文件
			template: './src/index.html', //模板文件，会原样输出
			filename: 'index.html', // 打包后的html模板的名称
			hash: true, //配置随机数去缓存
			minify: {
				//压缩html
				removeAttributeQuotes: true, //去掉引号
				collapseWhitespace: true // 去掉空格，html展示在一行
			}
		}),
		new MiniCssExtractPlugin({
			// css抽离 可以把css通过link标签插入在html中
			filename: 'main.css' // 抽离后的css文件名称
		})
	],
	module: {
		// 模块配置
		rules: [
			/*
        css-loader:解析css,如@import语法导入的css文件
        style-loader：把css插入到html的header标签中的style标签中
        loader的特点：希望单一，一个loader负责一个功能
        loader的用法：只有一个loader，用字符串，多个loader，用[]
        loader的顺序：默认从右往左，从下往上
      */
			// 方法一:loader用字符串形式
			/*
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        }
      */
			// 方法二：loader用对象形式，好处是可以添加配置项
			{
				test: /\.css$/,
				use: [
					// { // css插入htl的style标签中
					// 	loader: 'style-loader',
					// 	options: {
					// 		insert: function insertAtTop(element) {
					// 			// 外联样式，插入到head标签最前面，避免覆盖掉内联样式
					// 			var parent = document.querySelector('head');
					// 			var lastInsertedElement = window._lastElementInsertedByStyleLoader;
					// 			if (!lastInsertedElement) {
					// 				parent.insertBefore(element, parent.firstChild);
					// 			} else if (lastInsertedElement.nextSibling) {
					// 				parent.insertBefore(element, lastInsertedElement.nextSibling);
					// 			} else {
					// 				parent.appendChild(element);
					// 			}
					// 			window._lastElementInsertedByStyleLoader = element;
					// 		}
					// 	}
					// },
					MiniCssExtractPlugin.loader, // 把css通过link标签引入html中
					'css-loader',
					'postcss-loader' //使用postcss-loader 必须要配置postcss-config.js文件
				]
			},
			//处理less文件
			{
				test: /\.less$/,
				use: [ MiniCssExtractPlugin.loader, 'css-loader', 'less-loader', 'postcss-loader' ]
			}
		]
	}
};
