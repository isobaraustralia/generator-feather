var ExtractTextPlugin = require("extract-text-webpack-plugin");
var SpritesmithPlugin = require('webpack-spritesmith');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
module.exports = {
	entry: ['./src/js/app.js'],
	output: {
		path: './assets',
		filename: './js/app.js',
		publicPath: '/',
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{test: /\.(sass|scss)$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader", "sass-loader")},
			{test: /\.js$/, loader: 'babel', exclude: /node_modules/},
		],
		babel: {
			presets: ['es2015']
		}
	},
	resolve: {
		modulesDirectories: ["node_modules", "spritesmith-generated"]
	},
	plugins: [
		new ExtractTextPlugin("./css/styles.css"),
		new SpritesmithPlugin({
			src: {
				cwd: path.resolve(__dirname, 'src/sprites'),
				glob: '*.png'
			},
			target: {
				image: path.resolve(__dirname, 'src/img/sprite.png'),
				css: path.resolve(__dirname, 'src/sass/sprite.scss')
			},
			apiOptions: {
				cssImageRef: "~sprite.png"
			},
			retina: '@2x'
		}),
		new CopyWebpackPlugin([
			{from: 'src/img', to: 'img'},
			{from: 'src/fonts', to: 'fonts'}
		])
	]
}
