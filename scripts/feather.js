'use strict'
const request = require('request')
const extract = require('extract-zip')
const fs = require('fs')
const colors = require('colors/safe')
const spawn = require('child_process').spawn
var ncp = require('ncp').ncp
const path = require('path')

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
const VerifyPackage = (pkg) => {
  pkg.valid = false
  pkg.installed = false
  if(fs.existsSync('./' + pkg.name)) { pkg.installed = true }
  if(fs.existsSync(outFolder + pkg.path)){ pkg.valid = true }
  return pkg
}

// Logging
function log(msg, extra){
  if(process.env.NODE_ENV !== 'test') extra ? console.log(msg, extra) : console.log(msg)
}

module.exports.getLatest = function(){

  // Setup tmp folder
  try { fs.mkdirSync(tmpFolder) } catch(e) {}

  return new Promise((resolve, reject) => {
    // Grab Latest Zip of feather-packages
    log('Downloading Feather from github..')
    request
      .get(latestPackage)
      .on('error', err => reject(err))
      .on('response', res => log('Response: ' + colors.green(res.statusCode + ' OK') ))
      .pipe(fs.createWriteStream(zipFile))
      .on('finish', res => {

        // Extract Zip to tmp folder
        log('Download Complete, Extracting..')
        extract(zipFile, {dir: outFolder}, (err) => {
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

module.exports.install = function(installPkg){
  return new Promise( (resolve, reject) => {
    // Extract the package and return the location
    log('Extracting ' + installPkg.name + ' Package..')
    ncp(outFolder + installPkg.path, outFolder + 'pkg/', ncpOptions, (err) => {
      if(err) return reject(err)
      return resolve(outFolder + 'pkg/')
      })
  })
}

module.exports.cleanup = function(){
  return new Promise(resolve => {
    spawn('rm', ['-R', tmpFolder])
      .on('close', code => {
        resolve(true)
      })
  })
}
