'use strict'
const request = require('request')
const extract = require('extract-zip')
const fs = require('fs')
const colors = require('colors/safe')
const spawn = require('child_process').spawn
var ncp = require('ncp').ncp
const R = require('ramda')

// Settings
const tmpFolder = './tmp/'
const zipFile = tmpFolder + 'feather.latest.zip'
const outFolder = tmpFolder + 'feather.bootstrap/'
const latestPackage = 'https://github.com/Sitefinity/feather-packages/archive/master.zip'
const tick = colors.green('✔')
const cross = colors.red('✖')
const root = __dirname.replace('tools','') // root folder of quill

// Log piped files
const ncpOptions = {transform: (read, write) => {
  log('Copied ' + read.path.replace(__dirname, '') + ' -> ' + colors.green(write.path.replace(root, '')))
  read.pipe(write)
}}

// Expected packages to install
const Packages = [
  { name: 'Bootstrap',
    path: 'feather-packages-master/Bootstrap'},
  { name: 'Foundation',
    path: 'feather-packages-master/community-packages/Foundation'},
  { name: 'SemanticUI',
    path: 'feather-packages-master/community-packages/SemanticUI'},
  { name: 'Minimal',
    path: 'feather-packages-master/Minimal'}
]
module.exports.Packages = Packages

// Verify a package after it has been extracted
// @param Object pkg
// @return Boolean
const VerifyPackage = (pkg) => {
  pkg.valid = false
  pkg.installed = false
  if(fs.existsSync('./' + pkg.name)) { pkg.installed = true }
  if(fs.existsSync(outFolder + pkg.path)){ pkg.valid = true }
  return pkg
}

// Logging, disable when running test suite
// @param String msg
// @param Object extra
function log(msg, extra){
  /* istanbul ignore if */
  if(process.env.NODE_ENV !== 'test') extra ? console.log(msg, extra) : console.log(msg)
}

// Gets the current version of sitefinity
// @return String
module.exports.getSitefinityVersion = function(){
  return '9.2.6201.0'
}

// Takes the readme, returns a compatability table
const parseTable = function(readme){

  const tableStart = readme.indexOf('|----|----|')
  const tableEnd = readme.indexOf('# License')
  const justTable = readme.slice(tableStart, tableEnd)
  const rows = justTable.trim().split(/\r?\n/).slice(1)

  // Zips the row into a compatability object
  const zipRow = R.zipObj(['feather_from', 'feather_to', 'sf_from', 'sf_to'])

  // Parses the row into an array the gets zipped
  // @url http://stackoverflow.com/q/40401466/79722
  const parseRow = x => x.slice(1, -1).trim().replace('v.','').replace('v','').split(/\s+(?:\||-|to)\s+/)

  // Fixes a problem with SF docs being weird
  const safelyParseRow = x => {
    var row = parseRow(x)
    if(row.length === 3)
      return [row[0], row[0], row[1], row[2]]
    else
      return row
  }
  const table = R.map(zipRow, R.map(safelyParseRow, rows))
  return table
}
module.exports.parseTable = parseTable;

// Returns a list of the compatability table from feather
// @return Promise
module.exports.getCompatibility = function(){
  const opts = {
    url: 'https://raw.githubusercontent.com/Sitefinity/feather-packages/master/README.md',
    headers: { 'User-Agent': 'request' }
  }
  return new Promise((resolve, reject) => {
    log('Getting the feather -> sitefinity compatability table..')
    request(opts, (error, res, body) => {
      /* istanbul ignore if  */
      if(error || res.statusCode !== 200)
        error ? reject(error) : reject('Response: ' + res.statusCode)
      resolve(parseTable(body))
    })
  })
}

// Takes two versions, and returns true if x is greater than y
// @param String x XXX.XXX.XXX
// @param String y XX.XXXX.XXX
const isVersionGreater = function(x,y){
  if(y === 'latest') return false
  if(x === 'latest') return true
  const xs = R.map(parseInt, x.split('.'))
  const ys = R.map(parseInt, y.split('.'))
  for(var i in xs){
    if(xs[i] > ys[i]) return true
    if(xs[i] < ys[i]) return false
  }
  return false
}
module.exports.isVersionGreater = isVersionGreater

// Takes a sitefinity version and a tableRow and returns true if
//  the provided version row can be used
// @param String sfVersion
// @param Object tableRow
// @return Boolean
const isRowUsable = function(sfVersion, tableRow){
  return isVersionGreater(sfVersion, tableRow.sf_from) &&
    !isVersionGreater(sfVersion, tableRow.sf_to)
    ? true : false
}
module.exports.isRowUsable = isRowUsable

// Takes a sitefinity version and gives you the latest feather version that can be used
// @param String sitefinityVer
// @param Array table The return of getCompatibility()
// @return TableRow
module.exports.getValidVersion = function(sitefinityVer, table){
  for(var i in table){
    if(isRowUsable(sitefinityVer, table[i])) return table[i]
  }
  return false
}

// Return a list of packages as a Promise
// @return Promise
module.exports.listPackages = function(){
  const opts = {
    url: 'https://api.github.com/repos/Sitefinity/feather-packages/releases',
    headers: { 'User-Agent': 'request' }
  }
  return new Promise((resolve, reject) => {
    log('Getting a list of the latest packages..')
    request(opts, (error, res, body) => {
      /* istanbul ignore else  */
      if(!error && res.statusCode === 200){
        log('Response: ' + colors.green(res.statusCode + ' OK'))
      } else {
        log('Response: ' + colors.red(res.statusCode + ' ERROR!'))
        error ? reject(error) : reject('Response: ' + res.statusCode)
      }
      resolve(JSON.parse(body))
    })
  })
}

// 
module.exports.getLatest = function(){

  // Setup tmp folder
  try { fs.mkdirSync(tmpFolder) } catch(e) {}

  return new Promise((resolve, reject) => {
    // Grab Latest Zip of feather-packages
    log('Downloading Feather from github..')
    request
      .get(latestPackage)
      .on('response', res => log('Response: ' + colors.green(res.statusCode + ' OK') ))
      .pipe(fs.createWriteStream(zipFile))
      .on('finish', res => {

        // Extract Zip to tmp folder
        log('Download Complete, Extracting..')
        extract(zipFile, {dir: outFolder}, (err) => {
          /* istanbul ignore if */
          if(err) return reject(err)

          // Validate Packages
          const ValidPackages = Packages.map(VerifyPackage)
          log('\nFound '+colors.magenta(ValidPackages.length)+' Packages:')
          ValidPackages.forEach( (pkg, key) => {
            const pre = pkg.valid ? ' ' + tick + ' ' : ' ' + cross+ ' '
            const post = pkg.installed ? ' - ' + colors.yellow('Installed!') : ''
            log(pre + pkg.name + post)
          })

          // Ask User for package to install
          resolve(ValidPackages)
        })
      })
  })
}

// Install a package
// @param Object installPkg
// @return Promise
module.exports.install = function(installPkg){
  return new Promise( (resolve, reject) => {
    // Extract the package and return the location
    log('Extracting ' + installPkg.name + ' Package..')
    ncp(outFolder + installPkg.path, outFolder + 'pkg/', ncpOptions, (err) => {
      /* istanbul ignore if  */
      if(err) return reject(err)
      return resolve(outFolder + 'pkg/')
      })
  })
}


// Cleans up tmp folders
// @return Promise
module.exports.cleanup = function(){
  return new Promise(resolve => {
    spawn('rm', ['-R', tmpFolder])
      .on('close', code => {
        resolve(true)
      })
  })
}
