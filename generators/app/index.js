'use strict'
const generators = require('yeoman-generator')
const R = require('ramda')
const Feather = require('../../scripts/feather.js')
const path = require('path')
const colors = require('colors/safe')
const fs = require('fs')

module.exports = generators.Base.extend({

  constructor: function(){
    generators.Base.apply(this, arguments);
  },

  initializing: function(){
    this.foundWebConfig = fs.existsSync('../web.config')
    if(this.foundWebConfig){
      this.sfVersion = Feather.getSitefinityVersion(fs.readFileSync('../web.config', 'utf8'))
      this.log('Sitefinity version ' + colors.bold(colors.green(this.sfVersion)) + ' detected')
    } else {
      this.sfVersion = 'latest'
      this.log(colors.red('Error: ') + 'web.config not found at: ' + path.resolve('../'))
      this.log('Assuming latest sitefinity version')
    }
    return Feather.listPackages()
      .then(function(packages){
        this.log('Found ' + colors.green(packages.length) + ' versions of feather')
        this.allVersions = packages
        this.versionsList = R.append('latest', R.map(x => x.name, packages))
        return Feather.getCompatibility()
      }.bind(this)).then(function(table){
        const validVersion = Feather.getValidVersion(this.sfVersion, table)
        if(validVersion === false){
          this.log(colors.red('Error ') + 'determining a valid package to install! defaulting to latest')
          this.defaultVersion = 'latest'
        } else {
          this.defaultVersion = validVersion.feather_to
          this.log('Compatible Feather version detected: ' + colors.bold(colors.green(this.defaultVersion)))
        }
      }.bind(this))
  },

  // Prompt the user for input - http://yeoman.io/authoring/user-interactions.html
  prompting: function(){
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname
    }, {
      type: 'list',
      name: 'framework',
      message: 'Which framework do you want to use?',
      choices: ['Bootstrap', 'Foundation', 'Minimal', 'SemantecUi'],
      store: true
    }, {
      type: 'list',
      name: 'version',
      message: 'What version of Feather do you want to use?',
      choices: this.versionsList,
      default: this.defaultVersion
    }]).then(function(answers){
      this.answers = answers

      // determine package to download
      if(this.answers.version === 'latest'){
        this.zipballUrl = 'https://github.com/Sitefinity/feather-packages/archive/master.zip'
      } else {
        this.zipballUrl = 'https://github.com/Sitefinity/feather-packages/archive/master.zip'
      }
    }.bind(this))
  },

  getPackages: function(){
    var yo = this
    return Feather.getPackage(this.zipballUrl)
      .then(packages => yo.ValidPackages = packages)
  },

  writing: function(){

    // Bulk Copy Feather
    const origPath = this.sourceRoot()
    const frameworkProp = R.propEq('name', this.answers.framework)
    const pkg = R.find(frameworkProp, this.ValidPackages)
    this.sourceRoot( path.resolve('./tmp/feather.bootstrap/') )
    this.bulkDirectory(pkg.path, pkg.name)

    // Create helper functions for copying an array of files and templates
    const tplConfig = this.answers
    const copyTpl = ctx =>file => ctx.fs.copyTpl(ctx.templatePath(file), ctx.destinationPath(file), tplConfig)
    const copy = ctx =>file => ctx.fs.copy(ctx.templatePath(file), ctx.destinationPath(file))

    // Copy Files
    const tplFiles = [
      '.babelrc',
      '.editorconfig',
      'package.json',
      'yarn.lock',
      'webpack.config.js',
      'webpack.prod.config.js',
      'webpack.dev.config.js',
      'src/js',
      'src/sass'
    ]
    const bulkFiles = ['src/img', 'src/fonts', 'src/sprites']
    this.sourceRoot( origPath )
    R.map(copyTpl(this), tplFiles)
    R.map(copy(this), bulkFiles)

    // Write package specific template
    const pkgPath = origPath + '/../../' + pkg.name.toLowerCase() + '/templates'
    this.sourceRoot(pkgPath)
    R.map(copy(this), ['./'])

  },

  install: function(){
    this.spawnCommandSync('yarn', ['install'])
  },

  end: function(){
    console.log('cleaning up')
    return Feather.cleanup()
      .then(function(){
        this.log('Feather is now installed!')
      }.bind(this))
  }

})
