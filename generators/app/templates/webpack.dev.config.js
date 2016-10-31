var cfg = require('./webpack.config.js')

// Webpack Dev server specific config
cfg.output.publicPath = "{dev_url}"

module.exports = cfg