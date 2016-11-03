'use strict'
const generators = require('yeoman-generator')
const R = require('ramda')
const Feather = require('../../scripts/feather.js')
const path = require('path')
const colors = require('colors/safe')

module.exports = generators.Base.extend({

  constructor: function(){
    generators.Base.apply(this, arguments);
  },

  initializing: function(){
    this.sfVersion = Feather.getSitefinityVersion()
    this.log('Sitefinity ' + colors.bold(colors.green(this.sfVersion)) + ' detected')
    return Feather.listPackages()
      .then(function(packages){
        this.log('Found ' + colors.green(packages.length) + ' versions')
        this.allVersions = packages
        this.versionsList = R.append('latest', R.map(x => x.name, packages))
        return Feather.getCompatibility()
      }.bind(this)).then(function(table){
        const validVersion = Feather.getValidVersion(Feather.getSitefinityVersion(), table)
        if(validVersion === false){
          this.log(colors.red('Error ') + 'determining a valid package to install! defaulting to latest')
          this.defaultVersion = 'latest'
        } else {
          this.defaultVersion = validVersion.feather_to
          this.log('Compatible version detected: ' + colors.bold(colors.green(this.defaultVersion)))
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
      default: 'latest'
    }]).then(function(answers){
      this.answers = answers
    }.bind(this))
  },

  getPackages: function(){
    var yo = this
    return Feather.getLatest()
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
