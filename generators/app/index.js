'use strict'
const generators = require('yeoman-generator')
const R = require('ramda')
const Feather = require('../../scripts/feather.js')
const path = require('path')

module.exports = generators.Base.extend({

  constructor: function(){
    generators.Base.apply(this, arguments);
  },

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
      type: 'input',
      name: 'version',
      message: 'What version of sitefinity are you using',
      default: 'latest'
    }]).then(function(answers){
      this.answers = answers
    }.bind(this))
  },

  configuring: function(){

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

    // Write Template
    const copyTpl = ctx =>file => ctx.fs.copyTpl(ctx.templatePath(file), ctx.destinationPath(file))
    const copy = ctx =>file => ctx.fs.copy(ctx.templatePath(file), ctx.destinationPath(file))
    const files = ['package.json', 'yarn.lock', 'webpack.config.js', 'src/js', 'src/sass']
    this.sourceRoot( origPath )
    R.map(copyTpl(this), files)
    R.map(copy(this), ['src/img', 'src/fonts', 'src/sprites'])

    // Write package specific template
    const pkgPath = origPath + '/../../' + pkg.name.toLowerCase() + '/templates'
    this.sourceRoot(pkgPath)
    R.map(copy(this), ['./'])

  },

  install: function(){
    return this.spawnCommandSync('yarn', ['install'])
  },

  end: function(){
    console.log('cleaning up')
    return Feather.cleanup()
      .then(function(){
        this.log('Feather is now installed!')
      }.bind(this))
  }

})
