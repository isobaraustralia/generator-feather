'use strict'
process.env.NODE_ENV = 'test'
var chai = require('chai')
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
var expect = chai.expect
const exec = require('child_process').exec
const Bootstrap = require('../scripts/feather.js')
const fs = require('fs')
const helpers = require('yeoman-test')
const path = require('path')

describe('Feather Generator', function(){

  describe('Feather Fetcher', function(){

    this.timeout(5000)

    before('Delete all used folders', function(done){
      exec('rm -R tmp/', err => {
        done()
      })
    })

    beforeEach('wait', function(done){
      setTimeout(done, 1000)
    })

    it('can grab the latest package', function(){
      this.timeout(15000)
      return Bootstrap.getLatest()
        .then(function(x){
          expect(x).to.be.a('array')
          expect(x).to.have.length(4)
        })
    })

    it('can install Bootstrap', function(){
      this.retries(3);
      return Bootstrap.install(Bootstrap.Packages[0])
        .then(function(res){
          expect(res).to.be.a('string')
        })
    })
    it('can gather Foundation', function(){
      this.retries(3);
      return Bootstrap.install(Bootstrap.Packages[1])
        .then(function(res){
          expect(res).to.be.a('string')
        })
    })
    it('can gather SemanticUI', function(){
      this.retries(3);
      return Bootstrap.install(Bootstrap.Packages[2])
        .then(function(res){
          expect(res).to.be.a('string')
        })
    })
    it('can gather Minimal', function(){
      this.retries(3);
      return Bootstrap.install(Bootstrap.Packages[3])
        .then(function(res){
          expect(res).to.be.a('string')
        })
    })

    it('can clean up after itself', function(){
      return Bootstrap.cleanup()
        .then(function(res){
          expect(res).to.be.true
        })
    })

  })

  describe('yo:feather', function(){

    this.timeout(60000)
    var tmpPath = ''
    it('generate bootstrap from scratch', function(){
      return helpers.run(path.join(__dirname, '../generators/app'))
        .inTmpDir(function (dir) {
          tmpPath = dir
        })
        .withPrompts({ name: 'testapp', framework: 'Bootstrap', version: 'latest' })
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
      exec('cd ' + tmpPath + ' && ' + 'yarn run build', err => {
        expect(err).to.not.be.an('error')
        expect( fs.existsSync(tmpPath + '/package.json') ).to.be.true
        expect( fs.existsSync(tmpPath + '/assets/js/app.js') ).to.be.true
        expect( fs.existsSync(tmpPath + '/assets/js/app.js.map') ).to.be.true
        done()
      })
    })

    it('can run webpack directly', function(done){
      expect( tmpPath ).to.not.equal('')
      exec('cd ' + tmpPath + ' && ' + 'webpack', err => {
        expect(err).to.not.be.an('error')
        expect( fs.existsSync(tmpPath + '/package.json') ).to.be.true
        expect( fs.existsSync(tmpPath + '/assets/js/app.js') ).to.be.true
        expect( fs.existsSync(tmpPath + '/assets/js/app.js.map') ).to.be.true
        done()
      })

      it('can run webpack with minification', function(done){
        expect( tmpPath ).to.not.equal('')
        exec('cd ' + tmpPath + ' && ' + 'webpack --optimize-minimize --optimize-dedupe', err => {
          expect(err).to.not.be.an('error')
          expect( fs.existsSync(tmpPath + '/package.json') ).to.be.true
          expect( fs.existsSync(tmpPath + '/assets/js/app.js') ).to.be.true
          expect( fs.existsSync(tmpPath + '/assets/js/app.js.map') ).to.be.true
          done()
        })
      })

      it('can run webpack dev server')

      it('can yarn run lint without error', function(done){
        expect( tmpPath ).to.not.equal('')
        exec('cd ' + tmpPath + ' && ' + 'yarn run lint', err => {
          expect(err).to.not.be.an('error')
          done()
        })
      })

      it('can yarn run lintfix')
      it('it can yarn run test')


    })

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
