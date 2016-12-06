var cfg = require('./webpack.config.js')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var webpack = require('webpack')

// Disable dev flags

// Extract css bundle
var extractSASS = new ExtractTextPlugin('./css/styles.css')
cfg.module.loaders[0].loader = extractSASS.extract(['css','sass'])
cfg.plugins.push(extractSASS)

// Images
cfg.plugins.push(new CopyWebpackPlugin([{from: 'src/img', to: 'img'}]))

// Optimize Assets
cfg.plugins.push(new webpack.optimize.UglifyJsPlugin())
cfg.plugins.push(new webpack.optimize.DedupePlugin())

module.exports = cfg
