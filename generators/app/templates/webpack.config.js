var SpritesmithPlugin = require('webpack-spritesmith');
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
			{test: /\.(sass|scss)$/, loader: "style-loader!css-loader!sass-loader"},
			{test: /\.js$/, loader: 'babel', exclude: /node_modules/},
			//{test: /\.(svg|woff|ttf|otf)$/, loader: 'file?name=fonts/[name].[ext]]'}
		],
		babel: {
			presets: ['es2015']
		}
	},
	resolve: {
		modulesDirectories: ["node_modules", "spritesmith-generated"]
	},
	plugins: [
		//new ExtractTextPlugin("./css/styles.css"),
		new SpritesmithPlugin({
			src: { cwd: path.resolve(__dirname, 'src/sprites'), glob: '*.png' },
			target: {
				image: path.resolve(__dirname, 'src/img/sprite.png'),
				css: path.resolve(__dirname, 'src/sass/sprite.scss')
			},
			apiOptions: {	cssImageRef: "~sprite.png" },
			retina: '@2x'
		})
	]
}
