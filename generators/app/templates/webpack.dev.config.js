var cfg = require('./webpack.config.js')

// Webpack Dev server specific config
cfg.output.publicPath = "http://localhost:8080/"

module.exports = cfg
