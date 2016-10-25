'use strict'
const generators = require('yeoman-generator')
const R = require('ramda')

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
		}])
	},

	configuring: function(){

	},

	writing: function(){
		const copy = ctx =>file => ctx.fs.copyTpl(ctx.templatePath(file), ctx.destinationPath(file))
		const files = ['package.json', 'yarn.lock', 'webpack.config.js', 'src/']
		R.map(copy(this), files)
	},

	install: function(){
		this.spawnCommand('yarn', ['install'])
	},

	end: function(){
		console.log('bye')
	}

})
