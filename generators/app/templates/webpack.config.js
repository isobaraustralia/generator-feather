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
  externals: {
    jquery: 'jQuery'
  },
  module: {
    loaders: [
      {test: /\.(sass|scss)$/, loader: "style-loader!css-loader!sass-loader"},
      {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
      {test: /\.png/, loader: 'file?name=img/[name].[ext]'},
      {test: /\.ttf$|\.eot$|\.woff$|\.woff2$|\.svg$/, loader: 'file?name=font/[name].[ext]'}
    ],
    babel: { presets: ['es2015'] }
  },
  resolve: {
    modulesDirectories: ["node_modules", "spritesmith-generated"]
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, "node_modules/bootstrap-sass/assets/stylesheets/"),
      path.resolve(__dirname, "Bootstrap/assets/src/")
    ]
  },
  plugins: [
    //new ExtractTextPlugin("./css/styles.css"),
    new SpritesmithPlugin({
      src: { cwd: path.resolve(__dirname, 'src/sprites'), glob: '*.png' },
      target: {
        image: path.resolve(__dirname, 'src/img/sprite.png'),
        css: path.resolve(__dirname, 'src/sass/settings/_sprite.scss')
      },
      apiOptions: {	cssImageRef: "../img/sprite.png" },
      retina: '@2x'
    })
  ]
}
