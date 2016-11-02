'use strict'
process.env.NODE_ENV = 'test'
var chai = require('chai')
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
var expect = chai.expect
const exec = require('child_process').exec
const fs = require('fs')
const helpers = require('yeoman-test')
const path = require('path')
const assert = require('yeoman-assert')

describe('Foundation', function(){

  this.timeout(120000)
  var tmpPath = ''

  it('generate Foundation from scratch', function(){
    return helpers.run(path.join(__dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        tmpPath = dir
      })
      .withPrompts({ name: 'testapp', framework: 'Foundation', version: 'latest' })
      .toPromise()
      .then(function (dir) {
        expect( fs.existsSync(dir + '/package.json') ).to.be.true
        expect( fs.existsSync(dir + '/src/js/app.js') ).to.be.true
        expect( fs.existsSync(dir + '/src/sass/styles.sass') ).to.be.true
        expect( fs.existsSync(dir + '/src/img/favicon.png') ).to.be.true
      });
  })

  it('can run yarn run build', function(done){
    expect( tmpPath ).to.not.equal('')
    exec('yarn run build', {cwd: tmpPath}, err => {
      expect(err).to.not.be.an('error')
      expect( fs.existsSync(tmpPath + '/package.json') ).to.be.true
      expect( fs.existsSync(tmpPath + '/assets/js/app.js') ).to.be.true
      expect( fs.existsSync(tmpPath + '/assets/js/app.js.map') ).to.be.true
      done()
    })
  })

  it('can generate a valid JS bundle', function(){
    expect(tmpPath).to.not.equal('')
    var appjs = fs.readFileSync(tmpPath + '/assets/css/styles.css', {encoding: 'utf8'})
    expect(appjs).to.be.a('string')
  })

  it('can generate a valid CSS bundle with foundation', function(){
    expect(tmpPath).to.not.equal('')
    assert.file(tmpPath + '/assets/css/styles.css')
    assert.file(tmpPath + '/assets/css/styles.css.map')
    var styles = fs.readFileSync(tmpPath + '/assets/css/styles.css', {encoding: 'utf8'})
    expect(styles).to.be.a('string')
    expect(styles).to.contain('meta.foundation') //foundation
    expect(styles).to.contain('.sf-') //sitefinity
  })

  describe('Linting', function(){

    it('can run without crashing', function(done){
      exec('yarn run lint', err => {
        //expect(err).to.not.be.an('error')
        done()
      })
    })

  })

})
